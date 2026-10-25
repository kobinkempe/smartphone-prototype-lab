# Smartphone Prototype Lab

**A lab for using AI to prototype a complex learning experience, before choosing how to visualize and share a large research project.**

The research began with an educational question: what would it take to build a smartphone without the tools, factories and industrial infrastructure we take for granted? Following a phone back through its parts, materials and tools produces a huge web of information. I wanted to turn that web into something people could enjoy exploring.

This repository compares six working UX approaches to that problem. I used separate AI agents to turn competing ideas into interactive prototypes, then tried and refined them to decide which interactions make the research understandable: illustrated articles, animation, scrolling, 3D zoom, a spatial canvas or a collapsible stack.

The [Smartphone Research Map](https://github.com/kobinkempe/smartphone-research-map) organizes the research and its dependencies. This lab explores how to present that kind of information. The prototypes use a limited, separately authored speaker-and-tools journey; they do not yet load the full research registry automatically.

## Public demo

[Open the live demo](https://kobin-ai-portfolio.kobinkempe.chatgpt.site/smartphone-prototype-lab/) · [Read the case study](https://kobin-ai-portfolio.kobinkempe.chatgpt.site/case-studies/smartphone-prototype-lab/)

Six interactive ways to explore how a smartphone's parts and tools are made, using the speaker and its dependencies as a shared learning journey.

![Prototype collection](docs/screenshots/overview.jpg)
![Three-dimensional Zoom prototype](docs/screenshots/zoom.jpg)

## Product idea

An illustrated encyclopedia should let a reader follow a part into its making process without losing the path back to the phone. A tool is a different relationship: it helps make the part rather than becoming part of it. The prototypes compare ways to communicate that distinction while keeping a complex dependency structure navigable on desktop and phone.

| Approach | Interaction hypothesis |
| --- | --- |
| Encyclopedia | Detailed illustrated articles with clickable parts and tools. |
| Animation window | Animate a component into its inputs and assembly steps. |
| Scroll | Progress through making steps and return to the parent as the part completes. |
| Zoom | Enter a part/tool through zoom and follow making steps by directional pan. |
| Canvas | Navigate a spatial diagram with in-scene controls and explicit hierarchy. |
| Stack | Collapse the current level and open its child beneath a persistent ancestry trail. |

## Run locally

Python 3.10+ or another static HTTP server; no build or model credentials required.

```sh
python -m http.server 8000 --bind 127.0.0.1 --directory site
```

Open http://127.0.0.1:8000. Try Phone → Speaker → Coil → Wire, follow a tool-making detour, and return to the parent step. The older `prev-next` and `scroll-retired` folders preserve additional experiments; the six cards on the landing page are the current comparison set.

## AI and research workflow

I set the educational goal, interaction rules, visual direction and review criteria, then gave separate AI agents different prototype directions. Agents helped research the example content, create conceptual illustrations, implement interactions and respond to critique. I reviewed a first component before expanding a direction.

The difficult UX question is how to enter a part, follow its making steps, detour into a tool’s own making process and return without losing your place. Working versions let me compare that experience directly: does the motion explain a relationship, is the hierarchy clear, and does a return restore the exact step? AI made it practical to explore several approaches before committing to a full learning site. These browser demos run without a live model.

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for the complete connection between research, graph validation, map views and experience prototypes. Figure provenance is in [docs/ILLUSTRATION.md](docs/ILLUSTRATION.md). [Third-party notices](THIRD_PARTY.md).

## Scope and validation

The included static audit checks 93 files and 20 application scripts with no missing local references or JavaScript syntax errors. Desktop screenshots, the Zoom entry view and a nested learning journey are inspected in Chrome. This is a research prototype collection: conceptual geometry is enlarged for explanation, some child pages are explicitly marked stand-ins, and it is not a complete manufacturing encyclopedia. No fabrication success or learning-outcome metric is claimed.

Built with AI assistance; the demos do not call a model at runtime. [Publication review](PUBLICATION_REVIEW.md).
