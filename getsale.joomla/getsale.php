<?php
/**
 * @version     1.0.0
 * @Project     getSale
 * @author      getsale.io
 * @package
 * @copyright   Copyright (C) 2016 getsale.io. All rights reserved.
 * @license     GNU/GPL: http://www.gnu.org/copyleft/gpl.html
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');
jimport('joomla.plugin.plugin');

class plgSystemGetsale extends JPlugin
{
    public $app_key = '';
    public $email = '';
    public $url = '';
    public $projectId = '';
    public $error = '';
    public $regDomain = 'http://edge.getsale.io/';
    public  $rtDomain = "//rt.edge.getsale.io/loader.js";
    public $int_scrpt = '';

    public function __construct(& $subject, $config)
    {
        parent::__construct($subject, $config);

        if (!function_exists('curl_init')) {
            echo "getSale plugin problem. Php_curl not installed.
          Please install curl or disable plugin";
            exit();
        }

        // загрузка параметров плагина
        $this->isAdmin = JFactory::getApplication()->isAdmin();
        $this->app_key = $this->params->get('app_key', '');
        $this->email = $this->params->get('email', '');
        $this->projectId = $this->params->get('getsale_id','');
        $this->url = $this->currentUrl();

        //check and try to reg
        if (($this->email !== '') && ($this->app_key !== '') && empty($this->projectId)) {
            $id = $this->regbyApi();
            if (isset($id->payload->projectId)) {
                $this->projectId = $id->payload->projectId;
                $this->params->set('getsale_id', $id->payload->projectId);
            }
        }
        if (strlen($this->projectId) > 0) {
            JFactory::getDocument()->addScriptDeclaration($this->getjsCode() . $this->jsCode2);
        }

        //проверка на успешно авторизированный проект
        if ($this->isAdmin) {
            if (strlen($this->projectId) > 0) {
                JFactory::getDocument()->addScriptDeclaration('window.getsale_succes_reg = true');
                JFactory::getDocument()->addScriptDeclaration('window.getsale_id = ' . $this->projectId);

            } else {
                if (isset($id->code)) {
                    JFactory::getDocument()->addScriptDeclaration('window.getsale_succes_reg = false;window.getsale_reg_error = "' . $id->code . '"');
                } elseif (empty($id)) {
                    JFactory::getDocument()->addScriptDeclaration('window.getsale_succes_reg = false;window.getsale_reg_error = "0"');
                }
            }
        }
    }

    /**
     * Возвращает url
     */
    public function currentUrl()
    {
        $url = 'http';
        if (isset($_SERVER['HTTPS'])) {
            if ($_SERVER['HTTPS'] == 'on') {
                $url .= 's';
            }
        }
        $url .= '://';
        if ($_SERVER['SERVER_PORT'] != '80') {
            $url .= $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
        } else {
            $url .= $_SERVER['SERVER_NAME'];
        }
        return $url;
    }

    /** Main script
     * @throws Exception
     */
    public function getjsCode()
    {

        if ((strlen($this->projectId) > 0) && (!$this->isAdmin)) {
            return '
            /* GETSALE CODE START */

            (function(d, w, c) {
                  w[c] = {
                    projectId:' . $this->projectId . '
                  };

                  var n = d.getElementsByTagName("script")[0],
                  s = d.createElement("script"),
                  f = function () { n.parentNode.insertBefore(s, n); };
                  s.type = "text/javascript";
                  s.async = true;
                  s.src = "' . $this->rtDomain . '";
                  if (w.opera == "[object Opera]") {
                    d.addEventListener("DOMContentLoaded", f, false);
                  } else { f(); }
                })(document, window, "geSaleInit");

               /* GETSALE CODE END */
        ' . $this->int_scrpt;
        } else return;
    }

    public function regbyApi()
    {
        $domain = $this->regDomain;
        $email = $this->email;
        $key = $this->app_key;
        $url = $this->url;
        $projectId = $this->projectId;

        if (($domain == '') OR ($email == '') OR ($key == '') OR ($url == '') OR (!empty($projectId))) {
            return;
        }

        $ch = curl_init();
        $jsondata = json_encode(array(
            'email' => $email,
            'key' => $key,
            'url' => $url,
            'cms' => 'joomla'));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json', 'Accept: application/json'));
        curl_setopt($ch, CURLOPT_URL, $domain . "/api/registration.json");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsondata);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $server_output = curl_exec($ch);
        curl_close($ch);
        file_put_contents(JPATH_PLUGINS . '/system/getsale/log.txt', $server_output, FILE_APPEND);
        $json_result = json_decode($server_output);
        return $json_result;
    }
}
