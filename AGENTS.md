# AGENTS.md — TON Blockchain Bug Bounty Agent Instructions

## Overview

This file instructs the agent (Google Jules) on how to conduct a responsible bug bounty
research session on the TON Blockchain project. Before taking any action, the agent
**must** read the reference document listed below in full.

---

## Required Reading (Read This File First)

Before writing any code, running any tests, or forming any hypotheses, read the following
file completely:

1. `README-ton-bugbounty.md` — Full program scope, target repositories, priority areas,
   reward structure, submission channels, and frontend rules.

Do not proceed to any research or testing steps until this file has been read.

---

## In-Scope Targets

### TON Blockchain Core (C++)
Repository: https://github.com/ton-blockchain/ton

Priority components:
- **Catchain** — Byzantine fault-tolerant consensus protocol
- **Validator Node** — Core validator logic
- **Full Node** — Full node implementation
- **DHT Node** — Distributed hash table / peer discovery
- **TonLib** — Client library

> ⚠️ FunC and Fift compiler issues that do **not** cause critical problems during normal
> node operation are **out of scope**.

> The **testnet branch** is considered experimental and accepted for reports. Review may
> be postponed until the end of ongoing audits/tests — you will be notified on submission.

### Smart Contracts (FunC)
Standard smart contracts in `crypto/smartcont/`:
- `config-code.fc` — Network config
- `elector-code.fc` — Elector
- `simple-wallet-code.fc`, `wallet3-code.fc` — Wallets

Additional contract repos:
- Wallet V4 & subscriptions: https://github.com/ton-blockchain/wallet-contract
- Multisig: https://github.com/ton-blockchain/multisig-contract
- Nominator pool: https://github.com/ton-blockchain/nominator-pool
- Fungible / NFT / Semi-Fungible tokens: https://github.com/ton-blockchain/token-contract
- TON DNS: https://github.com/ton-blockchain/dns-contract

### Python
- MyTonCtrl validator tools: https://github.com/ton-blockchain/mytonctrl
- HTTP API: https://github.com/toncenter/ton-http-api
- Python SDK: https://github.com/toncenter/pytonlib

### Frontend
> ⚠️ All frontend/site issues must be sent to HackenProof, NOT to the Telegram bot.
> HackenProof page: https://hackenproof.com/programs/ton-society

Frontend targets:
- TON website: https://ton.org
- Web Wallet & Browser Extension: https://github.com/toncenter/ton-wallet
- JavaScript SDK: https://github.com/toncenter/tonweb
- JavaScript Mnemonic SDK: https://github.com/toncenter/tonweb-mnemonic

---

## Out-of-Scope — Do Not Test

- FunC/Fift compiler bugs that do not cause critical problems in normal node operation
- Standard OWASP header recommendations (will be rejected for frontend)
- Open IP addresses or open ports that do not lead to an actual attack
- DDoS attacks
- Third-party TON ecosystem services (contact them directly)

---

## What TON Considers High Value

TON is specifically interested in **critical** vulnerabilities:

- Node or validator **crashes**
- **Loss or theft of coins** (unauthorized fund movement)
- Consensus manipulation or Byzantine fault exploitation
- Smart contract logic flaws enabling fund drainage or lock-up bypass
- Remote code execution or memory corruption in the C++ core

Generic informational findings or low-impact issues are unlikely to be rewarded.

---

## Reward Reference

| Severity | Reward |
|----------|--------|
| Critical | Up to $100,000 USD equivalent in Toncoin |

> Large bounties for severe vulnerabilities come with a **1-year lock-up period**.
> TON reserves the right not to review some reports.

---

## Hard Rules — Must Be Followed At All Times

- Do **not** test on mainnet or any live public network.
- Do all work within this forked repository using a local or isolated environment.
- Do not conduct destructive testing against live infrastructure.
- Do not publicly disclose any vulnerability before it has been confirmed and addressed
  by the TON team.
- For smart contract PoCs, fork from mainnet state using Hardhat or equivalent —
  do not construct artificial local-only states that may not reflect real on-chain conditions.

---

## PoC Requirements

A valid submission must include:

- **Clear vulnerability description** — what it is, where it lives, why it is exploitable.
- **Exploitation scenario** — step-by-step explanation of how an attacker would exploit it.
- **Executable PoC** where applicable:
  - C++ core bugs: minimal reproducible test case or crash reproducer.
  - Smart contract bugs: Hardhat (or equivalent) fork-based test with clear print output
    showing impact (e.g., drained funds, broken invariants).
  - Python/SDK bugs: runnable script demonstrating the issue.
- **Impact assessment** — what could an attacker realistically achieve?
- For fund-related bugs, estimate total at-risk funds where possible.

---

## Submission Channels

| Target | Submit To |
|--------|-----------|
| Blockchain core, smart contracts, Python, SDKs | Telegram: @ton_bugs_bot |
| Frontend / websites | HackenProof: https://hackenproof.com/programs/ton-society |
| Third-party TON services | Contact each project directly |

---

## Workflow Summary for the Agent

```
1. READ README-ton-bugbounty.md in full.
2. SURVEY the codebase — map components: Catchain, Validator, Full Node, DHT, TonLib,
   smart contracts, Python tools.
3. PRIORITIZE high-value targets: consensus logic, fund-handling code, node crash vectors,
   smart contract arithmetic and access control.
4. VERIFY findings are in-scope (not FunC/Fift non-critical, not OWASP headers, etc.).
5. BUILD a minimal, reproducible PoC in an isolated/local environment only.
6. DOCUMENT clearly: description + exploitation scenario + impact + PoC.
7. SUBMIT via the correct channel (Telegram bot for core; HackenProof for frontend).
```
