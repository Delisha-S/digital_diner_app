import 'package:flutter/material.dart';
import '../models/ai_response.dart';
import '../services/ai_service.dart';

class AIChatWidget extends StatefulWidget {
  final String? userId;
  const AIChatWidget({Key? key, this.userId}) : super(key: key);

  @override
  State<AIChatWidget> createState() => _AIChatWidgetState();
}

class _AIChatWidgetState extends State<AIChatWidget> {
  final _controller = TextEditingController();
  final _service = AIService();
  bool _loading = false;
  String? _error;
  AIResponse? _response;

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _loading = true;
      _error = null;
      _response = null;
    });
    try {
      final resp = await _service.sendPrompt(prompt: text, userId: widget.userId);
      setState(() => _response = resp);
    } on AIException catch (e) {
      setState(() => _error = e.message);
    } catch (e) {
      setState(() => _error = 'Unexpected error');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: _controller,
          minLines: 1,
          maxLines: 6,
          decoration: InputDecoration(hintText: 'Enter prompt...'),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            ElevatedButton(
              onPressed: _loading ? null : _send,
              child: _loading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Send'),
            ),
            const SizedBox(width: 8),
            if (_response != null) Text('Response id: ${_response!.id}', style: const TextStyle(fontSize: 12)),
          ],
        ),
        const SizedBox(height: 12),
        if (_error != null)
          Text(_error!, style: const TextStyle(color: Colors.red)),
        if (_response != null)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Text(_response!.text),
            ),
          )
      ],
    );
  }
}
