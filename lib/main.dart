import 'package:flutter/material.dart';
import 'widgets/ai_chat_widget.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'AI Test App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: Scaffold(
        appBar: AppBar(
          title: const Text("AI Test Page"),
        ),
        body: const Padding(
          padding: EdgeInsets.all(16.0),
          child: AIChatWidget(),
        ),
      ),
    );
  }
}
