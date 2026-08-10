---
last_updated: 2026-08-11
topic: manufacturing
triage: read
source_type: standard
signal: 0.74
maturity: production
domains: manufacturing
source_url: https://ec.europa.eu/futurium/en/system/files/ged/a2-schweichhart-reference_architectural_model_industrie_4.0_rami_4.0.pdf
source_label: RAMI 4.0 (IEC PAS 63088:2017) →
published: 2017-07-01
---

# RAMI 4.0 — Reference Architecture Model Industrie 4.0

## TL;DR
RAMI 4.0 is the reference architecture for Industry 4.0 — the German-led, IEC-recognized (PAS 63088:2017) framework for connecting physical assets to digital systems. It is a three-dimensional coordinate system: the layers axis (Asset → Integration → Communication → Information → Functional → Business), the lifecycle/value stream axis (Development → Production → Sales → Service), and the hierarchy axis (Product → Field Device → Control Device → Station → Work Centers → Enterprise → Connected World). It is the most widely adopted Industry 4.0 reference model in Europe and is gaining adoption in US smart-manufacturing programs. The companion standard ISO/IEC WD 30188 (Digital Twin reference architecture) and IEC TR 63319 (smart manufacturing reference models, 2024) sit alongside it.

## Why it matters
If you build smart-manufacturing systems — anything from a connected CNC machine to a factory-floor analytics platform — RAMI 4.0 gives you the vocabulary and the structural framework. Without it, every integration is bespoke; with it, components from different vendors map to the same boxes on the same diagram, and SE work is decoupled from vendor selection. The US alternative is the Industrial Internet Reference Architecture (IIRA) from the Industrial Internet Consortium; the two are largely compatible and increasingly aligned through the IEC smart-manufacturing standards (IEC TR 63319 and IEC 63339, both 2024).

## Key ideas
- **Three axes, not a stack** — RAMI 4.0 is a cube, not a pyramid. The layers axis runs vertical (asset to business), the lifecycle axis runs horizontal (development to service), and the hierarchy axis runs into the page (product to connected world). A single asset lives at one (layer, lifecycle, hierarchy) coordinate.
- **The Administration Shell (AAS)** — every physical "Thing" has a digital "Administration Shell" that is its standardized interface to the I4.0 network. The AAS stores all data and metadata about the asset and serves as the integration point. This is the unit of interoperability.
- **Layer responsibilities** — Asset (the physical thing), Integration (sensor/actuator bridge), Communication (standardized protocols, OPC UA is the default), Information (data → events), Functional (services and operations), Business (business models, ordering, contracts).
- **Lifecycle coverage** — the same architecture applies across the product lifecycle: development (where the AAS is first defined), production (where the Thing is built and its AAS is populated), sales (where the AAS becomes the catalog entry), and service (where the AAS is the live operational record).
- **Hierarchy levels** — from the single product (Level 0) up to the connected world (Level 7). The hierarchy drives who owns the AAS, who can read it, and who can write to it. This is the trust boundary.
- **IIRA is the US counterpart** — the IIC's Industrial Internet Reference Architecture is a similar cube with slightly different axes (concerns instead of layers) and a stronger emphasis on cross-industry interoperability. The two are converging in the IEC smart-manufacturing standardization.
- **Digital twins are an instance, not a layer** — a digital twin is a special-purpose AAS that holds real-time state synchronized with the physical asset. It is not a separate layer in RAMI 4.0.
- **Cybersecurity is cross-cutting** — IT security cuts across all layers, all lifecycle phases, and all hierarchy levels. RAMI 4.0 treats it as a horizontal concern (a separate IEC standard, IEC 62443, is the implementation reference).

## So what
If you are starting a smart-manufacturing initiative, draw a RAMI 4.0 cube for your factory floor and start mapping your existing systems to it. Most factories find that 80% of their systems land naturally in the Information and Functional layers, with thin coverage in the Integration layer (the OT/IT bridge) — that's usually where to invest first. The AAS is the key artifact: if you can't describe an asset as an AAS, you can't interoperate. If you are in a US context and your customer base is US manufacturers, also build familiarity with IIRA — the procurement language often comes from there.

## When to use
- You are building or integrating smart-manufacturing systems
- You are specifying the architecture for a connected factory or a connected product
- You are writing a digital-twin strategy and need a framework
- You are interfacing with a German, Austrian, or Swiss industrial customer (RAMI 4.0 is the lingua franca)
- You are building an IIoT platform and need the cross-vendor integration story

## Sources & links
- RAMI 4.0 reference document — https://ec.europa.eu/futurium/en/system/files/ged/a2-schweichhart-reference_architectural_model_industrie_4.0_rami_4.0.pdf
- IEC PAS 63088:2017 (Smart manufacturing — Reference architecture model industry 4.0)
- Plattform Industrie 4.0 — https://www.plattform-i40.de
- Digital Twin reference model (2024) — https://www.plattform-i40.de/IP/Redaktion/DE/Downloads/Publikation/202404_Digital_twin_sustainable_industry.pdf
- ISO/IEC WD 30188 (Digital twin reference architecture, in development)
- IEC TR 63319:2024 (smart manufacturing reference models)
- IEC 63339:2024 (unified reference model for smart manufacturing)
- Industrial Internet Consortium IIRA — https://www.iiconsortium.org
