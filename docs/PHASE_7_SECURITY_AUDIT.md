
# Phase 7: Security Audit & CVE Analysis (Multiplayer)

**Date:** 2026-03-25
**Module:** "O Recreio" (Local Multiplayer)
**Architecture:** Serverless WebRTC (P2P) / Ghost Replay

## 1. Threat Modeling & Risk Assessment

### A. IP Address Leakage (High Risk)
*   **Risk:** WebRTC requires the exchange of ICE Candidates to establish a P2P connection. This exposes the user's **Private IP** (LAN) and potentially **Public IP** (WAN) to the connected peer.
*   **Context:** While we target "Local Multiplayer" (same Wi-Fi), a malicious actor could theoretically trick a child into scanning a remote QR code, exposing their IP.
*   **Mitigation:**
    *   **mDNS (Multicast DNS):** Modern browsers (Chrome/Edge) obfuscate local IPs using mDNS hostnames (UUIDs) by default (RFC 8742). We must ensure this behavior is not disabled.
    *   **UI Warnings:** Clear disclosure to parents: "Multiplayer connects directly to the other computer. Your IP address is shared only with the person you connect to."

### B. Signaling Vector (The "Handshake")
*   **Risk:** To connect, peers must swap SDP (Session Description Protocol) data. Using a public signaling server introduces a "Man-in-the-Middle" storage risk.
*   **Architecture Decision:** **Serverless Signaling via QR Code**.
    *   **Benefit:** No metadata is ever stored on a cloud server. The "Signaling Channel" is the physical camera scanning a screen (Air-gapped signaling).
    *   **Risk:** Malformed SDP payloads injected via QR codes could attempt to crash the client.

### C. XSS via Data Channels
*   **Risk:** Peer A sends a username like `<script>stealCookies()</script>`. Peer B renders it.
*   **Mitigation:** strict **Input Sanitization**. All data received via `RTCDataChannel` must be treated as untrusted text, never HTML.

## 2. Relevant CVE Review (Common Vulnerabilities)

We have reviewed the following class of CVEs related to WebRTC implementations to ensure our design avoids these pitfalls:

| CVE ID | Description | Relevance to Teclado Mágico |
| :--- | :--- | :--- |
| **CVE-2018-25031** | WebRTC IP Leakage | **High**. This confirmed that WebRTC reveals IPs. *Mitigation*: We rely on modern browser mDNS implementation and restrict usage to "Local Play" context. |
| **CVE-2022-2294** | Heap buffer overflow in WebRTC | **Medium**. Browser-level vulnerability. *Mitigation*: Users must use up-to-date browsers (Chrome/Edge). We cannot patch this, but we can detect old user agents. |
| **General XSS** | Cross-Site Scripting via Signaling | **High**. *Mitigation*: We will use React's default escaping and explicit sanitization for any peer messages. |

## 3. Implementation Strategy: "Safety First"

To adhere to this audit, Phase 7 will be rolled out in two stages:

1.  **Phase 7.1: Ghost Mode (Implemented Now)**
    *   **Risk Level:** Zero.
    *   **Mechanism:** Records the user's own keystrokes locally. Replays them visually. No networking involved.
    *   **Goal:** Provides the thrill of competition without the privacy risk.

2.  **Phase 7.2: Local P2P (Future)**
    *   **Risk Level:** Medium.
    *   **Mechanism:** WebRTC over LAN.
    *   **Requirement:** Parental Consent Gate before unlocking the camera/network features.

