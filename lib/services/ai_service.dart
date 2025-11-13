import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/ai_response.dart';

/// Base URL is read from a compile-time define or falls back to emulator loopback.
final String apiBaseUrl = const String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:4000',
);

class AIService {
  final Duration timeout;

  AIService({this.timeout = const Duration(seconds: 30)});

  Uri _uri(String path) => Uri.parse('$apiBaseUrl$path');

  Future<AIResponse> sendPrompt({
    required String prompt,
    String? userId,
    Map<String, dynamic>? extra,
  }) async {
    final uri = _uri('/api/ai');
    final body = {
      'prompt': prompt,
      if (userId != null) 'userId': userId,
      if (extra != null) 'extra': extra,
    };

    http.Response res;
    try {
      res = await http
          .post(uri, headers: {'Content-Type': 'application/json'}, body: jsonEncode(body))
          .timeout(timeout);
    } on TimeoutException {
      throw AIException('Request timed out. Please try again.');
    } on Exception catch (e) {
      throw AIException('Network error: $e');
    }

    if (res.statusCode == 200) {
      try {
        final json = jsonDecode(res.body) as Map<String, dynamic>;
        return AIResponse.fromJson(json);
      } catch (e) {
        throw AIException('Invalid response from server.');
      }
    } else {
      if (res.statusCode == 429) throw AIException('Rate limit exceeded. Try again later.');
      if (res.statusCode >= 500) throw AIException('Server error. Try again later.');
      try {
        final parsed = jsonDecode(res.body);
        final message = parsed is Map && parsed['error'] != null
            ? (parsed['error']['message'] ?? parsed['error'].toString())
            : res.body;
        throw AIException('Error ${res.statusCode}: $message');
      } catch (_) {
        throw AIException('Error ${res.statusCode}: ${res.reasonPhrase}');
      }
    }
  }
}

class AIException implements Exception {
  final String message;
  AIException(this.message);
  @override
  String toString() => 'AIException: $message';
}
