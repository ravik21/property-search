<?php


namespace App\Console\Commands;

use Google_Client;
use GuzzleHttp;
use Illuminate\Console\Command;
use App\Models\Language;
use App\Http\Controllers\GoogleClientController as Google;

class Languages_library_import extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'localisation:import {sheet}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command should read languages file and create locality files';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $sheet = $this->argument('sheet');

        $client = Google::client(['https://spreadsheets.google.com/feeds'],"Languages Sheet Reading");

        $fileId = '1D2X6omXKjLB2cT3Tcl35D-DXlzGXaChwg_J3HfJtsk8';

        $tokenArray = $client->fetchAccessTokenWithAssertion();
        $accessToken = $tokenArray["access_token"];

        $url = "https://sheets.googleapis.com/v4/spreadsheets/" . $fileId . "/values/" . $sheet;
        $method = 'GET';
        $headers = ["Authorization" => "Bearer $accessToken", "GData-Version" => "3.0"];
        $httpClient = new GuzzleHttp\Client(['headers' => $headers]);

        $resp = $httpClient->request($method, $url);

        $body = $resp->getBody()->getContents();
        $result = json_decode($body);

        $pre_parse = [];

        foreach ($result->values as $r) {
            if (is_array($r) && !empty($r)) {
                unset($r[0]);
                $pre_parse[] = $r;
            }
        }

        $pre_results = [];
        $keys = [];

        foreach ($pre_parse[0] as $k => $lang) {
            if ($lang == '' || $lang == 'Description' || $lang == 'Example link') {
                continue;
            }

            if ($lang != 'stringname') {
                $pre_results[$lang] = array();
            }

            foreach ($pre_parse as $p => $phrase) {
                if ($p == 0) {
                    continue;
                }

                if ($lang == 'stringname') {
                    $keys[] = $phrase[$k];
                } else {
                    $pre_results[$lang][] = (isset($phrase[$k])) ? $phrase[$k] : "";

                }
            }
        }

        $result = array();

        foreach ($pre_results as $lang => $pr) {
            $result[$lang] = array();
            foreach ($pr as $k => $v) {
              if(isset($keys[$k]))
                $result[$lang][$keys[$k]] = $v;
            }
        }

        // handling file creation

        foreach ($result as $lang => $phrases) {
            $lang_parts = explode(' - ', $lang);
			      $shortLang = $lang_parts[1];
            $lang_path = app()->resourcePath() . '/lang/' . $lang_parts[1];

            if (!is_dir($lang_path)) {
                mkdir($lang_path);
            }

            if (!is_file($lang_path . '/' . $sheet . '.php')) {
                touch($lang_path . '/' . $sheet . '.php');
            }

            $file_content = "<?php" . PHP_EOL . PHP_EOL;
            $file_content .= "return [" . PHP_EOL;

            foreach ($phrases as $k => $p) {

                // Use english if localisation has not been set
                if ($p == "") {
                    if (in_array(env('APP_ENV'), ['local','dev'])) {
                        $p = $result['English - en'][$k]; //Go back to English default
                    } else {

                        $targetLang = $shortLang;

                        if(preg_match("/es/", $shortLang, $match))
                            $targetLang = 'es';

                        //Try google translate
                        //Empty check for empty cells
                        $english= $result['English - en'][$k];
                        if($english == '') continue;
                        $text = $this->translate($english,"en",$targetLang);
                        if (strlen($text)>0 && !stripos($text,"SPAM") ) $p = $text;    // Google cached translation
                        else $p = $result['English - en'][$k]; //Go back to English default
                    }
                }

                $p = str_replace('"', "'", $p);

                if (strpos($p, '[') && strpos($p, ']')) {
                  $file_content .= str_replace("'", '"', $p).PHP_EOL;
                } else {
                  $file_content .= '"' . $k . '" => "' . trim($p) . '",' . PHP_EOL;
                }
            }

            $file_content .= '];';

            file_put_contents($lang_path . '/' . $sheet . '.php', $file_content);
        }

        echo 'Sheet ' . $sheet . ' has been imported!' . PHP_EOL;
        return;
    }



	public function translate($text,$source,$target)
	{
				//print "source=$source ,target = $target , text=$text , \n";
        $translateParmsWithExe = Language::translateParmsWithExe(['source'=>$source,'target'=>$target]);
        $source = $translateParmsWithExe['source'];
        $target = $translateParmsWithExe['target'];

				if (strlen($text)<1) return false;
				if (strlen($source)<1) return false;
				if (strlen($target)<1) return false;
				if ($target == $source) return $text;
				$md5File = md5($source.$target.$text);

				$dir = sys_get_temp_dir(). "/projeckt_lang/";
				@mkdir($dir);
				$file = $dir . $md5File . ".trans";

				if (file_exists($file) && filesize($file)> 0)
				{
					$response = file_get_contents($file);
					return $response;
				}
				else
				{
          echo 'Target Lang : '. $target ." -- Translating : " . $text .PHP_EOL;
					$url = "http://test.co/manual/translate.php?q=" . urlencode($text) . '&target=' . trim($target) . '&source=' . trim($source);
					$response = file_get_contents($url);
				}

				if(strlen($response)>0)
				{
					if (strpos($response,'code":40') || strpos($response,'"spam"') )
						{
							//print "return false 1";
							return false;
						}
					else
						{
							//print "got result..";
							file_put_contents($file,$response);
							return $response;
						}
				}
				else{
					//print "return false 2";
					return false;
				}


	}

}
