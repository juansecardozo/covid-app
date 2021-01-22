<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    public function getDataByCountries()
    {
        $http = new \GuzzleHttp\Client;
        try {
            $quote_request = $http->get("https://disease.sh/v3/covid-19/countries", [
                "query" => [
                    "sort" => "cases"
                ]
            ]);
            $response = json_decode($quote_request->getBody(), true);
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\ServerException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        }

        return ["status" => "success", "data" => $response];
    }

    public function getDataPerDay()
    {
        $http = new \GuzzleHttp\Client;
        try {
            $quote_request = $http->get("https://disease.sh/v3/covid-19/historical/all", [
                "query" => [
                    "lastdays" => 15
                ]
            ]);
            $response = json_decode($quote_request->getBody(), true);
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\ServerException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        }

        $new_data = [];

        foreach ($response as $key => $value) {
            $arr = [];
            $current = 0;
            foreach ($value as $i => $stats) {
                if ($stats - $current == $stats && $stats != 0) {
                    $current = $stats;
                    continue;
                }
                array_push($arr, ['date' => $i, 'stats' => $stats - $current]);
                $current = $stats;
            }
            $new_data[$key] = $arr;
        }

        return ["status" => "success", "data" => $new_data];
    }

    public function getDataByCountry($id)
    {
        $http = new \GuzzleHttp\Client;
        try {
            $quote_request = $http->get("https://disease.sh/v3/covid-19/countries/" . $id);
            $response = json_decode($quote_request->getBody(), true);
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\ServerException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        }

        $data = $response;

        $http = new \GuzzleHttp\Client;
        try {
            $quote_request = $http->get("https://disease.sh/v3/covid-19/historical/". $id, [
                "query" => [
                    "lastdays" => 15
                ]
            ]);
            $response = json_decode($quote_request->getBody(), true);
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\ServerException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            return ["status" => "error", "message" => "Unable to communicate with service provider"];
        }

        $new_data = [];

        foreach ($response['timeline'] as $key => $value) {
            $arr = [];
            $current = 0;
            foreach ($value as $i => $stats) {
                if ($stats - $current == $stats && $stats != 0) {
                    $current = $stats;
                    continue;
                }
                array_push($arr, ['date' => $i, 'stats' => $stats - $current]);
                $current = $stats;
            }
            $new_data[$key] = $arr;
        }

        $data['timeline'] = $new_data;

        return ["status" => "success", "data" => $data];
    }
}
