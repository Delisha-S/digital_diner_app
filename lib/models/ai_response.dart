class AIResponse {
  final String id;
  final String text;
  final Map<String, dynamic>? meta;

  AIResponse({required this.id, required this.text, this.meta});

  factory AIResponse.fromJson(Map<String, dynamic> json) {
    return AIResponse(
      id: json['id']?.toString() ?? '',
      text: json['text']?.toString() ?? '',
      meta: json['meta'] is Map<String, dynamic> ? Map<String, dynamic>.from(json['meta']) : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'text': text,
        if (meta != null) 'meta': meta,
      };
}
