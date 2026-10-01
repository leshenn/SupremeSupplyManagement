<?php
if (!defined('ABSPATH')) exit;

if (!class_exists('SSM_CSV_Importer')) {
    class SSM_CSV_Importer {
        public static function normalize_header($header) {
            $header = preg_replace('/^\xEF\xBB\xBF/', '', (string) $header);
            $header = strtolower(trim($header));
            $header = preg_replace('/[^a-z0-9]+/', '_', $header);
            return trim($header, '_');
        }

        public static function parse_uploaded_csv($file, $max_rows = 5000) {
            if (!is_array($file) || empty($file['tmp_name'])) {
                return new WP_Error('ssm_csv_missing_file', 'Please choose a CSV file first.');
            }
            if (!empty($file['error'])) {
                return new WP_Error('ssm_csv_upload_error', 'The CSV upload failed with error code ' . intval($file['error']) . '.');
            }
            if (!is_uploaded_file($file['tmp_name'])) {
                return new WP_Error('ssm_csv_invalid_upload', 'WordPress could not verify the uploaded CSV file.');
            }
            $name = isset($file['name']) ? (string) $file['name'] : '';
            if (strtolower(pathinfo($name, PATHINFO_EXTENSION)) !== 'csv') {
                return new WP_Error('ssm_csv_wrong_type', 'Please upload a .csv file.');
            }
            if (!empty($file['size']) && intval($file['size']) > wp_max_upload_size()) {
                return new WP_Error('ssm_csv_too_large', 'The CSV is larger than the WordPress upload limit.');
            }

            $handle = fopen($file['tmp_name'], 'r');
            if (!$handle) return new WP_Error('ssm_csv_open_failed', 'The CSV file could not be opened.');

            $raw_headers = fgetcsv($handle);
            if (!$raw_headers || !is_array($raw_headers)) {
                fclose($handle);
                return new WP_Error('ssm_csv_no_headers', 'The CSV must include a header row.');
            }

            $headers = array_map([__CLASS__, 'normalize_header'], $raw_headers);
            $headers = array_values($headers);
            if (in_array('', $headers, true)) {
                fclose($handle);
                return new WP_Error('ssm_csv_blank_header', 'Every CSV column needs a header name.');
            }
            if (count(array_unique($headers)) !== count($headers)) {
                fclose($handle);
                return new WP_Error('ssm_csv_duplicate_header', 'The CSV contains duplicate column names after normalization.');
            }

            $rows = [];
            $source_row = 1;
            while (($values = fgetcsv($handle)) !== false) {
                $source_row++;
                if (count($rows) >= $max_rows) {
                    fclose($handle);
                    return new WP_Error('ssm_csv_too_many_rows', 'This importer accepts up to ' . intval($max_rows) . ' data rows at a time.');
                }
                $has_value = false;
                foreach ($values as $value) {
                    if (trim((string) $value) !== '') { $has_value = true; break; }
                }
                if (!$has_value) continue;

                $values = array_pad($values, count($headers), '');
                if (count($values) > count($headers)) {
                    $values = array_slice($values, 0, count($headers));
                }
                $row = array_combine($headers, $values);
                $row['_csv_row'] = $source_row;
                $rows[] = $row;
            }
            fclose($handle);

            if (!$rows) return new WP_Error('ssm_csv_no_rows', 'The CSV does not contain any data rows.');
            return ['headers' => $headers, 'rows' => $rows];
        }

        public static function store_import($prefix, $rows) {
            $user_id = get_current_user_id();
            $import_id = wp_generate_password(20, false, false);
            $key = self::transient_key($prefix, $user_id, $import_id);
            set_transient($key, ['rows' => array_values($rows), 'created' => time()], 30 * MINUTE_IN_SECONDS);
            return $import_id;
        }

        public static function transient_key($prefix, $user_id, $import_id) {
            return 'ssm_csv_' . substr(md5($prefix . '|' . intval($user_id) . '|' . $import_id), 0, 28);
        }

        public static function get_import($prefix, $import_id) {
            $key = self::transient_key($prefix, get_current_user_id(), sanitize_text_field($import_id));
            $data = get_transient($key);
            if (!is_array($data) || !isset($data['rows']) || !is_array($data['rows'])) {
                return new WP_Error('ssm_csv_expired', 'This import session expired. Please upload the CSV again.');
            }
            return $data;
        }

        public static function get_row($prefix, $import_id, $index) {
            $data = self::get_import($prefix, $import_id);
            if (is_wp_error($data)) return $data;
            $index = intval($index);
            if (!array_key_exists($index, $data['rows'])) {
                return new WP_Error('ssm_csv_bad_row', 'The requested CSV row was not found.');
            }
            return $data['rows'][$index];
        }

        public static function delete_import($prefix, $import_id) {
            delete_transient(self::transient_key($prefix, get_current_user_id(), sanitize_text_field($import_id)));
        }

        public static function csv_status($value, $default = 'publish') {
            $status = strtolower(trim((string) $value));
            return in_array($status, ['publish', 'draft', 'pending', 'private'], true) ? $status : $default;
        }

        public static function find_post($post_type, $slug, $title) {
            $slug = sanitize_title((string) $slug);
            if ($slug !== '') {
                $post = get_page_by_path($slug, OBJECT, $post_type);
                if ($post) return $post;
            }
            $title = trim((string) $title);
            if ($title !== '') {
                $posts = get_posts([
                    'post_type' => $post_type,
                    'post_status' => 'any',
                    'posts_per_page' => 1,
                    'title' => $title,
                    'suppress_filters' => false,
                ]);
                if ($posts) return $posts[0];
            }
            return null;
        }

        public static function output_template($filename, $headers, $sample_row = []) {
            nocache_headers();
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . sanitize_file_name($filename) . '"');
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, $headers);
            if ($sample_row) {
                $row = [];
                foreach ($headers as $header) $row[] = $sample_row[$header] ?? '';
                fputcsv($out, $row);
            }
            fclose($out);
            exit;
        }

        public static function render_import_page($args) {
            $title = $args['title'] ?? 'CSV Import';
            $description = $args['description'] ?? '';
            $columns = $args['columns'] ?? [];
            $prepare_action = $args['prepare_action'];
            $process_action = $args['process_action'];
            $nonce_action = $args['nonce_action'];
            $template_action = $args['template_action'];
            $template_url = wp_nonce_url(admin_url('admin-post.php?action=' . rawurlencode($template_action)), $template_action);
            $nonce = wp_create_nonce($nonce_action);
            ?>
            <div class="wrap ssm-csv-wrap">
                <h1><?php echo esc_html($title); ?></h1>
                <?php if ($description): ?><p class="ssm-csv-lead"><?php echo esc_html($description); ?></p><?php endif; ?>

                <div class="ssm-csv-card">
                    <div class="ssm-csv-card-head">
                        <div>
                            <h2>Import from CSV</h2>
                            <p>Upload the file once. Rows are then processed one at a time so you can see progress and any individual failures.</p>
                        </div>
                        <a class="button" href="<?php echo esc_url($template_url); ?>">Download CSV template</a>
                    </div>

                    <?php if ($columns): ?>
                        <details class="ssm-csv-columns">
                            <summary>Expected columns</summary>
                            <code><?php echo esc_html(implode(', ', $columns)); ?></code>
                        </details>
                    <?php endif; ?>

                    <div class="ssm-csv-controls">
                        <input type="file" id="ssm-csv-file" accept=".csv,text/csv" />
                        <button class="button button-primary" id="ssm-csv-start" type="button">Start import</button>
                    </div>

                    <div id="ssm-csv-progress-wrap" class="ssm-csv-progress-wrap" hidden>
                        <div class="ssm-csv-progress-meta"><strong id="ssm-csv-progress-label">Preparing…</strong><span id="ssm-csv-progress-percent">0%</span></div>
                        <div class="ssm-csv-progress"><span id="ssm-csv-progress-bar"></span></div>
                        <div class="ssm-csv-counts">
                            <span class="success">Imported: <strong id="ssm-csv-success-count">0</strong></span>
                            <span class="warning">Warnings: <strong id="ssm-csv-warning-count">0</strong></span>
                            <span class="failure">Failed: <strong id="ssm-csv-failure-count">0</strong></span>
                        </div>
                    </div>

                    <div id="ssm-csv-global-error" class="notice notice-error inline" hidden><p></p></div>

                    <div id="ssm-csv-results-wrap" class="ssm-csv-results-wrap" hidden>
                        <h2>Import results</h2>
                        <table class="widefat striped">
                            <thead><tr><th style="width:90px">CSV row</th><th style="width:110px">Status</th><th>Result</th></tr></thead>
                            <tbody id="ssm-csv-results"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>
                .ssm-csv-wrap{max-width:1050px}.ssm-csv-lead{max-width:760px;font-size:14px}.ssm-csv-card{background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:22px;margin-top:20px}.ssm-csv-card-head{display:flex;gap:20px;justify-content:space-between;align-items:flex-start}.ssm-csv-card-head h2{margin:0 0 6px}.ssm-csv-card-head p{margin:0;max-width:680px}.ssm-csv-columns{margin:18px 0}.ssm-csv-columns code{display:block;margin-top:8px;padding:10px;background:#f6f7f7;white-space:normal}.ssm-csv-controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:18px 0}.ssm-csv-progress-wrap{margin-top:22px}.ssm-csv-progress-meta{display:flex;justify-content:space-between;margin-bottom:7px}.ssm-csv-progress{height:14px;background:#e7e9ec;border-radius:999px;overflow:hidden}.ssm-csv-progress span{display:block;width:0;height:100%;background:#2271b1;transition:width .2s ease}.ssm-csv-counts{display:flex;gap:20px;margin-top:10px}.ssm-csv-counts .success{color:#008a20}.ssm-csv-counts .warning{color:#996800}.ssm-csv-counts .failure{color:#b32d2e}.ssm-csv-results-wrap{margin-top:24px}.ssm-csv-status{font-weight:600}.ssm-csv-status.success{color:#008a20}.ssm-csv-status.warning{color:#996800}.ssm-csv-status.failure{color:#b32d2e}@media(max-width:700px){.ssm-csv-card-head{display:block}.ssm-csv-card-head .button{margin-top:14px}.ssm-csv-counts{display:block}.ssm-csv-counts span{display:block;margin:4px 0}}
            </style>
            <script>
            (() => {
                const fileInput = document.getElementById('ssm-csv-file');
                const start = document.getElementById('ssm-csv-start');
                const progressWrap = document.getElementById('ssm-csv-progress-wrap');
                const progressBar = document.getElementById('ssm-csv-progress-bar');
                const progressLabel = document.getElementById('ssm-csv-progress-label');
                const progressPercent = document.getElementById('ssm-csv-progress-percent');
                const resultsWrap = document.getElementById('ssm-csv-results-wrap');
                const results = document.getElementById('ssm-csv-results');
                const globalError = document.getElementById('ssm-csv-global-error');
                const successCount = document.getElementById('ssm-csv-success-count');
                const warningCount = document.getElementById('ssm-csv-warning-count');
                const failureCount = document.getElementById('ssm-csv-failure-count');
                const nonce = <?php echo wp_json_encode($nonce); ?>;
                const prepareAction = <?php echo wp_json_encode($prepare_action); ?>;
                const processAction = <?php echo wp_json_encode($process_action); ?>;
                let counts = {success: 0, warning: 0, failure: 0};

                const setError = (message) => {
                    globalError.hidden = false;
                    globalError.querySelector('p').textContent = message;
                };
                const clearError = () => { globalError.hidden = true; globalError.querySelector('p').textContent = ''; };
                const updateCounts = () => { successCount.textContent = counts.success; warningCount.textContent = counts.warning; failureCount.textContent = counts.failure; };
                const addResult = (row, status, message) => {
                    resultsWrap.hidden = false;
                    const tr = document.createElement('tr');
                    const tdRow = document.createElement('td'); tdRow.textContent = row || '—';
                    const tdStatus = document.createElement('td');
                    const badge = document.createElement('span'); badge.className = 'ssm-csv-status ' + status; badge.textContent = status === 'success' ? 'Imported' : status === 'warning' ? 'Warning' : 'Failed'; tdStatus.appendChild(badge);
                    const tdMessage = document.createElement('td'); tdMessage.textContent = message || '';
                    tr.append(tdRow, tdStatus, tdMessage); results.appendChild(tr);
                };
                const postForm = async (formData) => {
                    const response = await fetch(ajaxurl, {method: 'POST', body: formData, credentials: 'same-origin'});
                    const text = await response.text();
                    let json;
                    try { json = JSON.parse(text); } catch (e) { throw new Error('WordPress returned an invalid response. Check the PHP/server error log.'); }
                    if (!response.ok) throw new Error('The server returned HTTP ' + response.status + '.');
                    return json;
                };

                start.addEventListener('click', async () => {
                    clearError(); results.innerHTML = ''; resultsWrap.hidden = true; counts = {success:0, warning:0, failure:0}; updateCounts();
                    if (!fileInput.files || !fileInput.files[0]) { setError('Choose a CSV file before starting the import.'); return; }
                    start.disabled = true; fileInput.disabled = true; progressWrap.hidden = false; progressBar.style.width = '0%'; progressPercent.textContent = '0%'; progressLabel.textContent = 'Reading CSV…';
                    try {
                        const prepare = new FormData();
                        prepare.append('action', prepareAction); prepare.append('_ajax_nonce', nonce); prepare.append('csv_file', fileInput.files[0]);
                        const prepared = await postForm(prepare);
                        if (!prepared.success) throw new Error((prepared.data && prepared.data.message) ? prepared.data.message : 'The CSV could not be prepared.');
                        const importId = prepared.data.import_id; const total = Number(prepared.data.total || 0);
                        if (!total) throw new Error('No data rows were found in the CSV.');

                        for (let index = 0; index < total; index++) {
                            progressLabel.textContent = `Importing row ${index + 1} of ${total}…`;
                            const form = new FormData();
                            form.append('action', processAction); form.append('_ajax_nonce', nonce); form.append('import_id', importId); form.append('index', String(index));
                            try {
                                const response = await postForm(form);
                                if (response.success) {
                                    const data = response.data || {}; const status = data.status === 'warning' ? 'warning' : 'success'; counts[status]++; addResult(data.row, status, data.message || 'Imported.');
                                } else {
                                    const data = response.data || {}; counts.failure++; addResult(data.row || index + 2, 'failure', data.message || 'This row could not be imported.');
                                }
                            } catch (rowError) {
                                counts.failure++; addResult(index + 2, 'failure', rowError.message || 'Network/server error while importing this row.');
                            }
                            updateCounts();
                            const percent = Math.round(((index + 1) / total) * 100); progressBar.style.width = percent + '%'; progressPercent.textContent = percent + '%';
                        }
                        progressLabel.textContent = counts.failure ? 'Import completed with errors.' : counts.warning ? 'Import completed with warnings.' : 'Import complete.';
                    } catch (error) {
                        setError(error.message || 'The import could not be started.'); progressLabel.textContent = 'Import stopped.';
                    } finally {
                        start.disabled = false; fileInput.disabled = false;
                    }
                });
            })();
            </script>
            <?php
        }
    }
}
