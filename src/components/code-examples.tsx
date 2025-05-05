
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { CodeBlockHighlighted } from "./code-block-highlighted";

interface CodeExamplesProps {
  step: string;
  language?: string;
  csrfToken?: string;
  username?: string;
  password?: string;
  sessionToken?: string;
  amount?: string;
  webhookUrl?: string;
  redirectUrl?: string;
  apiBaseUrl: string;
}

export function CodeExamples({ 
  step, 
  language = "curl",
  csrfToken = "",
  username = "",
  password = "",
  sessionToken = "",
  amount = "",
  webhookUrl = "",
  redirectUrl = "",
  apiBaseUrl
}: CodeExamplesProps) {
  const getCodeExample = (step: string, language: string) => {
    const baseUrl = apiBaseUrl;
    
    switch(step) {
      case 'step1':
        switch(language) {
          case 'curl':
            return `curl -X GET \\
  '${baseUrl}/auth/csrf'`;
          case 'python':
            return `import requests

response = requests.get('${baseUrl}/auth/csrf')
print(response.json())`;
          case 'javascript':
            return `fetch('${baseUrl}/auth/csrf', {
  method: 'GET'
})
.then(response => response.json())
.then(data => console.log(data));`;
          case 'php':
            return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => '${baseUrl}/auth/csrf',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET'
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error: " . $err;
} else {
  echo $response;
}`;
          case 'ruby':
            return `require 'uri'
require 'net/http'

uri = URI.parse('${baseUrl}/auth/csrf')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = Net::HTTP::Get.new(uri.request_uri)
response = http.request(request)

puts response.body`;
          case 'java':
            return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${baseUrl}/auth/csrf"))
            .GET()
            .build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenAccept(System.out::println)
            .join();
    }
}`;
          default:
            return '';
        }
      case 'step2':
        switch(language) {
          case 'curl':
            return `curl -X POST \\
  '${baseUrl}/auth/login' \\
  -H 'Content-Type: application/json' \\
  -H 'X-CSRF-Token: ${csrfToken || '<YOUR_CSRF_TOKEN>'}' \\
  -d '{
    "username": "${username || '<YOUR_USERNAME>'}",
    "password": "${password || '<YOUR_PASSWORD>'}"
  }'`;
          case 'python':
            return `import requests

headers = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': '${csrfToken || '<YOUR_CSRF_TOKEN>'}'
}

data = {
    'username': '${username || '<YOUR_USERNAME>'}',
    'password': '${password || '<YOUR_PASSWORD>'}'
}

response = requests.post('${baseUrl}/auth/login', 
    json=data, 
    headers=headers
)
print(response.json())`;
          case 'javascript':
            return `fetch('${baseUrl}/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': '${csrfToken || '<YOUR_CSRF_TOKEN>'}'
  },
  body: JSON.stringify({
    username: '${username || '<YOUR_USERNAME>'}',
    password: '${password || '<YOUR_PASSWORD>'}'
  })
})
.then(response => response.json())
.then(data => console.log(data));`;
          case 'php':
            return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => '${baseUrl}/auth/login',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode([
    'username' => '${username || '<YOUR_USERNAME>'}',
    'password' => '${password || '<YOUR_PASSWORD>'}'
  ]),
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'X-CSRF-Token: ${csrfToken || '<YOUR_CSRF_TOKEN>'}'
  ]
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error: " . $err;
} else {
  echo $response;
}`;
          case 'ruby':
            return `require 'uri'
require 'net/http'
require 'json'

uri = URI.parse('${baseUrl}/auth/login')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = Net::HTTP::Post.new(uri.request_uri)
request['Content-Type'] = 'application/json'
request['X-CSRF-Token'] = '${csrfToken || '<YOUR_CSRF_TOKEN>'}'
request.body = {
  username: '${username || '<YOUR_USERNAME>'}',
  password: '${password || '<YOUR_PASSWORD>'}'
}.to_json

response = http.request(request)
puts response.body`;
          case 'java':
            return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        String jsonBody = String.format("""
            {
                "username": "${username || '<YOUR_USERNAME>'}",
                "password": "${password || '<YOUR_PASSWORD>'}"
            }
            """);
            
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${baseUrl}/auth/login"))
            .header("Content-Type", "application/json")
            .header("X-CSRF-Token", "${csrfToken || '<YOUR_CSRF_TOKEN>'}")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenAccept(System.out::println)
            .join();
    }
}`;
          default:
            return '';
        }
      case 'step3':
        switch(language) {
          case 'curl':
            return `curl -X POST \\
  '${baseUrl}/payments/cash-in' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}' \\
  -d '{
    "amount": ${amount || '<AMOUNT_IN_CENTS>'},
    "currency": "PHP"${webhookUrl ? ',\n    "webhook_url": "' + webhookUrl + '"' : ''}${redirectUrl ? ',\n    "redirect_url": "' + redirectUrl + '"' : ''}
  }'`;
          case 'python':
            return `import requests

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}'
}

data = {
    'amount': ${amount || '<AMOUNT_IN_CENTS>'},
    'currency': 'PHP'${webhookUrl ? ",\n    'webhook_url': '" + webhookUrl + "'" : ''}${redirectUrl ? ",\n    'redirect_url': '" + redirectUrl + "'" : ''}
}

response = requests.post('${baseUrl}/payments/cash-in', 
    json=data, 
    headers=headers
)
print(response.json())`;
          case 'javascript':
            return `fetch('${baseUrl}/payments/cash-in', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}'
  },
  body: JSON.stringify({
    amount: ${amount || '<AMOUNT_IN_CENTS>'},
    currency: 'PHP'${webhookUrl ? ',\n    webhook_url: "' + webhookUrl + '"' : ''}${redirectUrl ? ',\n    redirect_url: "' + redirectUrl + '"' : ''}
  })
})
.then(response => response.json())
.then(data => console.log(data));`;
          case 'php':
            return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => '${baseUrl}/payments/cash-in',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode([
    'amount' => ${amount || '<AMOUNT_IN_CENTS>'},
    'currency' => 'PHP'${webhookUrl ? ",\n    'webhook_url' => '" + webhookUrl + "'" : ''}${redirectUrl ? ",\n    'redirect_url' => '" + redirectUrl + "'" : ''}
  ]),
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'Authorization: Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}'
  ]
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error: " . $err;
} else {
  echo $response;
}`;
          case 'ruby':
            return `require 'uri'
require 'net/http'
require 'json'

uri = URI.parse('${baseUrl}/payments/cash-in')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = Net::HTTP::Post.new(uri.request_uri)
request['Content-Type'] = 'application/json'
request['Authorization'] = 'Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}'
request.body = {
  amount: ${amount || '<AMOUNT_IN_CENTS>'},
  currency: 'PHP'${webhookUrl ? ",\n  webhook_url: '" + webhookUrl + "'" : ''}${redirectUrl ? ",\n  redirect_url: '" + redirectUrl + "'" : ''}
}.to_json

response = http.request(request)
puts response.body`;
          case 'java':
            return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        String jsonBody = String.format("""
            {
                "amount": ${amount || '<AMOUNT_IN_CENTS>'},
                "currency": "PHP"${webhookUrl ? ',\n                "webhook_url": "' + webhookUrl + '"' : ''}${redirectUrl ? ',\n                "redirect_url": "' + redirectUrl + '"' : ''}
            }
            """);
            
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${baseUrl}/payments/cash-in"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer ${sessionToken || '<YOUR_SESSION_TOKEN>'}")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenAccept(System.out::println)
            .join();
    }
}`;
          default:
            return '';
        }
      default:
        return '';
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <Label>Code Examples</Label>
      <Tabs defaultValue={language} className="w-full">
        <TabsList>
          <TabsTrigger value="curl">cURL</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="php">PHP</TabsTrigger>
          <TabsTrigger value="ruby">Ruby</TabsTrigger>
          <TabsTrigger value="java">Java</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curl">
          <CodeBlockHighlighted
            code={getCodeExample(step, 'curl')}
            language="bash"
            title={`${step === 'step1' ? 'Get CSRF Token' : step === 'step2' ? 'Login' : 'Cash-in'} using cURL`}
          />
        </TabsContent>
        <TabsContent value="python">
          <CodeBlockHighlighted
            code={getCodeExample(step, 'python')}
            language="python"
            title={`${step === 'step1' ? 'Get CSRF Token' : step === 'step2' ? 'Login' : 'Cash-in'} using Python`}
          />
        </TabsContent>
        <TabsContent value="javascript">
          <CodeBlockHighlighted
            code={getCodeExample(step, 'javascript')}
            language="javascript"
            title={`${step === 'step1' ? 'Get CSRF Token' : step === 'step2' ? 'Login' : 'Cash-in'} using JavaScript`}
          />
        </TabsContent>
        <TabsContent value="php">
          <CodeBlockHighlighted
            code={getCodeExample(step, 'php')}
            language="php"
            title={`${step === 'step1' ? 'Get CSRF Token' : step === 'step2' ? 'Login' : 'Cash-in'} using PHP`}
          />
        </TabsContent>
        <TabsContent value="ruby">
          <CodeBlockHighlighted
            code={getCodeExample(step, 'ruby')}
            language="ruby"
            title={`${step === 'step1' ? 'Get CSRF Token' : step === 'step2' ? 'Login' : 'Cash-in'} using Ruby`}
          />
        </TabsContent>
        <TabsContent value="java">
          <CodeBlockHighlighted
            code={getCodeExample(step, 'java')}
            language="java"
            title={`${step === 'step1' ? 'Get CSRF Token' : step === 'step2' ? 'Login' : 'Cash-in'} using Java`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
