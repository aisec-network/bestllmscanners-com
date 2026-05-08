---
title: "Best LLM Security Scanners: Open-Source and Enterprise Tools Compared"
description: "A practitioner's comparison of the best LLM security scanners — Garak, PyRIT, LLM Guard, Promptfoo, Vigil, and enterprise options. Coverage, CI/CD fit, and runtime use cases."
pubDate: 2026-05-08
author: "Best LLM Scanners Editorial"
tags: ["llm-security", "vulnerability-scanning", "red-teaming", "open-source", "guardrails"]
category: "tools"
sources:
  - title: "OWASP Top 10 for Large Language Model Applications"
    url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
  - title: "garak: LLM Vulnerability Scanner — NVIDIA GitHub"
    url: "https://github.com/NVIDIA/garak"
  - title: "Announcing Microsoft's open automation framework to red team generative AI Systems"
    url: "https://www.microsoft.com/en-us/security/blog/2024/02/22/announcing-microsofts-open-automation-framework-to-red-team-generative-ai-systems/"
  - title: "Garak: Open-source LLM vulnerability scanner — Help Net Security"
    url: "https://www.helpnetsecurity.com/2025/09/10/garak-open-source-llm-vulnerability-scanner/"
schema:
  type: "TechArticle"
---

The best LLM security scanners today fall into two distinct categories that solve different halves of the same problem: pre-deployment red teaming (find the holes before you ship) and runtime protection (catch live attacks before they succeed). Conflating the two is the most common mistake teams make when evaluating tools. This guide separates them clearly, covers the tools that actually see production use in 2026, and gives you a starting point for building a stack without paying for overlap.

## The Threat Model Driving the Scanner Market

Before picking tools, it helps to understand what they're scanning for. The [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) is the canonical reference. Prompt injection (LLM01) leads the list: crafted inputs manipulate LLMs into unauthorized actions, data disclosure, or bypassing safety instructions. Below it sit insecure output handling, training data poisoning, sensitive information disclosure, insecure plugin design, and excessive agency — the risk that an LLM-powered agent takes consequential actions with insufficient oversight.

Scanners that target pre-deployment vulnerabilities mostly probe LLM01, LLM02, and LLM06. Runtime guards cover the real-time threat surface: a production endpoint receiving untrusted user input. A complete stack needs both.

For a deeper breakdown of the attack techniques these scanners are designed to catch, [aisec.blog](https://aisec.blog) covers prompt injection and jailbreak mechanics in operational detail.

## Pre-Deployment Scanners: Find Holes Before You Ship

**Garak (NVIDIA)**

Garak is the closest thing LLM security has to Nessus. [Released and actively maintained by NVIDIA](https://github.com/NVIDIA/garak), v0.15.0 shipped May 1, 2026. Install it with `pip install -U garak`, point it at an OpenAI endpoint or local model, and it runs a structured suite of probes covering hallucination, data leakage, prompt injection, jailbreaks, encoding-based attacks, toxicity, and more. It supports OpenAI APIs, Hugging Face, AWS Bedrock, Replicate, Cohere, Groq, GGML/llama.cpp, and custom REST endpoints.

The architecture is modular: probes are decoupled from detectors, which makes it straightforward to add custom probes for domain-specific risks. Results log as JSONL, which integrates cleanly with whatever reporting pipeline you already have. For CI/CD, you can run a targeted subset of probes rather than the full suite, which brings scan time from hours to minutes.

Garak's broad coverage makes it the right first tool for any LLM security assessment. Its weakness is that it runs single-turn probes by default — it does not natively simulate the kind of multi-turn conversation escalation that sophisticated attackers use against deployed agents.

**PyRIT (Microsoft)**

[PyRIT](https://www.microsoft.com/en-us/security/blog/2024/02/22/announcing-microsofts-open-automation-framework-to-red-team-generative-ai-systems/) (Python Risk Identification Toolkit) fills the multi-turn gap. Microsoft built it to automate the tedious parts of red teaming, and its architecture reflects that: targets, datasets, scorers, converters, orchestrators, and a memory layer that logs every prompt, transform, and result to SQLite or Azure SQL.

The orchestrators are where PyRIT differentiates. `RedTeamingOrchestrator` runs multi-turn conversations where an attacker LLM generates follow-ups based on the target's responses. `CrescendoOrchestrator` gradually escalates — benign-seeming turns that become increasingly adversarial — which mirrors how real attackers approach well-guarded systems. `TreeOfAttacksWithPruningOrchestrator` explores multiple attack paths in parallel and prunes dead ends.

PyRIT supports multi-modal targets (text, image, audio, video) and wires into Azure AI Content Filters for scoring. It's MIT-licensed; your only cost is the LLMs you use for attack generation.

The tradeoff: setup is more involved than Garak. PyRIT rewards teams who can invest time in configuring custom orchestrators and harm taxonomies. For a model exposed as a general-purpose chat endpoint, Garak gets you coverage faster. For an agentic system with tool access, PyRIT's multi-turn orchestration is the better fit.

**Promptfoo**

Promptfoo occupies the CI/CD niche. It runs assertions against LLM outputs — semantic similarity, regex, LLM-graded criteria — and integrates natively with GitHub Actions. Teams use it to catch regressions across model updates: define expected behaviors once, gate every deployment. Its free core is open source; the commercial tier adds a hosted dashboard and team features. For organizations already doing LLMOps with automated deployment pipelines, Promptfoo is the easiest scanner to operationalize. See [llmops.report](https://llmops.report) for how teams fit evaluation tooling into their deployment workflows.

## Runtime Scanners: Block Live Attacks in Production

**LLM Guard**

LLM Guard is the leading open-source runtime option. It sits in front of your production API and applies a pipeline of analyzers to both incoming prompts and outgoing responses. On the input side: prompt injection detection, PII anonymization, toxic content classification, regex-based blocklists. On the output side: sensitive data detection, relevance scoring, factual consistency checks.

The analyzer pipeline is configurable — you enable what you need and tune thresholds per use case. It runs locally, so no data leaves your environment, which matters for regulated industries. The tradeoff is that you own the infrastructure and the latency budget: adding multiple analyzers stacks up processing time, and you'll need to benchmark carefully to stay under acceptable response latencies for your users.

**Vigil**

Vigil takes a layered approach to prompt injection detection: vector database similarity search (comparing incoming prompts against a database of known attack patterns), YARA rule matching, transformer model classification, and canary token detection. The combination handles both known attack signatures and semantic variants that evade signature-only detectors.

It works well alongside LLM Guard rather than as a replacement — Vigil's multi-method injection detection paired with LLM Guard's output analysis gives broader coverage than either alone.

**Lakera Guard**

For teams that want runtime protection without managing the infrastructure, Lakera Guard is the dominant commercial option. It integrates with a single line of code, processes prompts in under 50ms, and runs on proprietary threat intelligence updated from real-world attack patterns. It covers prompt injection, data leakage, and harmful content across a wide range of LLM APIs.

The case for Lakera is operational simplicity: no infrastructure to run, no models to update, no tuning threshold decisions to make. The case against it is the same as any managed security service — you're trusting a third party with your prompts, latency depends on their uptime, and pricing scales with volume.

## How to Build a Stack

The standard starting point: **Garak for pre-deployment scanning + LLM Guard in front of the production API**. This mirrors the SAST-plus-WAF pattern from web application security — test before you ship, filter at runtime. Add PyRIT if you're shipping an agentic system that uses tools or takes external actions. Add Promptfoo if you have a CI/CD pipeline and want automated regression testing on every deploy.

Enterprise teams evaluating the full commercial landscape should also look at WhyLabs LLM Security (strong on observability), Protect AI's Guardian (focused on model supply chain), and Lakera Guard (operational simplicity). For hands-on reviews of these tools, [aisecreviews.com](https://aisecreviews.com) publishes assessments against real-world attack scenarios.

None of these scanners replace red teaming by humans who understand your specific application context, user base, and abuse surface. They automate the repeatable parts. The judgment calls about what to block, at what threshold, and what the acceptable false positive rate is — those remain engineering decisions.

---

## Sources

- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — The canonical LLM vulnerability taxonomy. Version 1.1 defines the threat categories most scanners are designed to test against.

- [garak: LLM Vulnerability Scanner — NVIDIA GitHub](https://github.com/NVIDIA/garak) — The garak repository, including probe documentation, supported targets, and release notes for v0.15.0 (May 2026).

- [Announcing Microsoft's open automation framework to red team generative AI Systems](https://www.microsoft.com/en-us/security/blog/2024/02/22/announcing-microsofts-open-automation-framework-to-red-team-generative-ai-systems/) — Microsoft's original PyRIT announcement, covering architecture rationale and early results from internal red teaming exercises.

- [Garak: Open-source LLM vulnerability scanner — Help Net Security](https://www.helpnetsecurity.com/2025/09/10/garak-open-source-llm-vulnerability-scanner/) — Security practitioner overview of Garak's probe coverage and operational use cases.
