import type { Result } from "../types/Search";


const nr = (href: string, description: string, context: string): Result => ({
	href: `https://${href}`,
	description,
	context
});

const results: Result[] = [
	nr('en.wikipedia.org', 'Zero-knowledge proof - Wikipedia', `In cryptography, a zero-knowledge proof or zero-knowledge protocol is a method by which one party (the prover) can prove to another party (the verifier) ...`),
	nr('hackernoon.com', `Zero Knowledge Proof: Explain it Like I'm 5 (Halloween Edition)`, `Oct 27, 2020 — Zero Knowledge Protocol (or Zero Knowledge Password Proof, ZKP) is a way of doing authentication where no passwords are exchanged, ...`),
	nr('www.bbva.com', 'Zero Knowledge Proof: how to maintain privacy in a data ...', `Jun 23, 2020 — Is it possible to show that something is true without revealing the data that proves it? This is what 'Zero Knowledge Proof' technology ...`),
	nr('crypto.stanford.edu', 'Zero-Knowledge Proofs', `Zero-Knowledge Proof Systems ... The goal is to prove a statement without leaking extra information, for example, for some N,x N , x , prove x x is a quadratic ...`),
	nr('wired.com', 'What Are Zero-Knowledge Proofs? | WIRED', `Sep 14, 2019 — Zero-knowledge protocols are probabilistic assessments, which means they don't prove something with the complete certainty that simply revealing ...`),
	nr('101blockchains.com', 'Zero Knowledge Proof: A Introductory Guide - 101 Blockchains', `Nov 29, 2021 — The concept behind zero-knowledge proof is unique indeed. A zero-knowledge proof is a unique method where a user can prove to another user that ...`),
	nr('doubleoctopus.com', 'What is Zero Knowledge Proof? | Security Wiki - Double Octopus', `Zero knowledge proof or protocol is a way for a “prover” to convince a “verifier” that a statement about some secret information is true without revealing ...`),
	nr('zkproof.org', 'ZKProof Standards: Homepage', 'ZKProof is an open-industry academic initiative that seeks to mainstream zero-knowledge proof (ZKP) cryptography through an inclusive, community-driven ...'),
	nr('blockheadtechnologies.com', 'Zero-knowledge proofs - a powerful addition to blockchain', `Jun 1, 2021 — Zero-knowledge proof is an encryption scheme whereby one party (the prover) can prove the truth of specific information to another party ...`),
];

export {
	results,
}