# Future component research — no additional prototype pages yet

These notes are new research for the next approved slices. They are not derived from prior project prototypes or the old user stories, which the user explicitly rejected. Proposed groupings are fresh design inferences from the current request, not source-described bills of materials. Keep each screen within roughly 10–15 meaningful items while exposing honest groups and further branches.

## Relationship model

- Part of: physical containment (coil → speaker → sound system → smartphone).
- Becomes: material transformations (ore → concentrate → impure copper → refined copper → wire).
- Used to make/test: reusable tools, fixtures and test equipment. These do not belong physically to the final speaker.
- Supplies energy to: electricity, mechanical drive, fuel/heat. Treat the source as a reusable service with a contextual return path.
- Consumed in: chemicals, adhesives and process gases. Do not falsely represent them as lasting parts of the finished device.
- Prerequisite: enabling infrastructure or earlier capability. Cycles require a chosen bootstrap route, not infinite recursive containment.

Every navigation path should retain the user's reason for entering a shared dependency, not only a fixed parent. A meter used to test both a generator and a speaker needs different return routes.

## Copper extraction using early tools

Heneb's historic environment record documents Great Orme ore removed from soft host rock using hammerstones, bone and antler tools. This is a specific geological example; do not imply every copper deposit can be worked with stone tools. Separate native metal from copper-bearing ore; extraction is not refining. A future screen can use four headlines (identify an appropriate deposit, expose ore, separate it from host rock, sort and prepare) with ore/host rock as materials, hammerstone and pointed implement as tools, carrying/sorting equipment, and visible output plus rejects. Do not add hazardous fire-setting instructions as a shortcut. Tool fabrication, geology identification and mining infrastructure deserve their own branches.

Primary record: https://archwilio.org.uk/her/chi3/report/page.php?watprn=GAT1694
Mine's educational material: https://www.greatormemines.info/wp-content/uploads/2023/03/Teachers-resource-FINAL.pdf

## Copper refining

Choose ore chemistry before choosing the process. Copper Development Association distinguishes a sulfide route (beneficiation and smelting) from an oxide route (leaching and solvent extraction). EPA describes smelting → matte, converting → blister copper, fire refining → anodes, and electrolytic refining → refined copper. Simply heating generic copper ore is not a sufficient chain.

Proposed first UI stress test: electrorefining as one bounded process, with impure copper anode, cathode, electrolyte, DC supply and cell as distinct roles; four headlines: set up the cell, drive controlled current, recover copper, check the product. Make upstream sulfide processing a separate group, and downstream casting/drawing/annealing/insulation a wire-making group. Electricity powers the refining cell, while the cell is a tool and copper is the transformed material. Avoid treating smelting, electrorefining and wire drawing as a single small component.

Sources:
- https://web.archive.org/web/20251127144626/https://copper.org/education/copper-production/ (archived copy)
- https://web.archive.org/web/20251029062050/https://copper.org/education/copper-production/6.php (archived copy)
- https://semspub.epa.gov/work/HQ/189955.pdf
- https://www.epa.gov/sites/default/files/2020-11/documents/c12s03.pdf

## Electricity generation

EIA describes generators as energy converters. A chosen mechanical source turns a generator; energy is not obtained from magnets alone. DOE's wind explanation gives wind → aerodynamic rotor → shaft → generator. For a bootstrap teaching example, distinguish a small demonstrator generator from a stable DC supply suitable for electrorefining or test equipment; its required power and regulation matter.

Proposed 13-node screen: 4 steps + generator + 4 grouped subassemblies (magnetic system, insulated winding, rotor/shaft/bearings, support/terminals) + mechanical input + assembly tools + test instruments + output conditioning. Conditioning may require further parts and must be honestly grouped. “Electricity” is an energy/service page with links to sources and loads, not a contained speaker part. Show load demand, output type, and the return-to-task path. Handle the copper-wire/generator bootstrap dependency explicitly; the app should surface an alternative earlier power method, rather than a circular recipe.

Sources:
- https://www.eia.gov/energyexplained/electricity/how-electricity-is-generated.php
- https://www.energy.gov/cmei/systems/how-do-wind-turbines-work

## Lithography and microchip production

ASML describes lithography as pattern projection onto photosensitive wafers, repeated across each wafer. Its manufacturing overview separately discusses deposition, photoresist, lithography, etching, ion implantation and packaging. Lithography is one process in multilayer chip fabrication, not an entire chip-making machine. Cleaning, metrology, interconnect and test also need their own treatment and more process-specific research before authoring.

Choose a technological level explicitly: a teaching-scale photolithography demonstration is not a machine capable of a modern smartphone processor. DUV uses lenses; EUV uses reflective optics and requires vacuum because air/materials absorb its light. Do not draw EUV passing through glass lenses. A machine page should group source/illumination, reticle system, projection optics, wafer positioning/handling, sensing/control, and environmental/utility systems. At 4 steps + machine + 6 assemblies + facility support + power + metrology tool, there are already 14 nodes; branch further instead of compressing their manufacture into a few misleading lines.

Suggested first later approval slice: a pattern-exposure process with wafer/resist/mask as materials, exposure system as tool, power/environment as dependencies, and expose/develop/inspect as distinct actions. Building the exposure system is a separate tool-making branch with its own approval and technical level.

Sources:
- https://www.asml.com/en/technology/lithography-principles
- https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps
- https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors
- https://www.zeiss.com/semiconductor-manufacturing-technology/products/lithography-optics.html
- https://www.zeiss.com/semiconductor-manufacturing-technology/smt-magazine/so-does-euv-lithography-work.html

## Future verification after approval

For every approved prototype, exercise physical subpart navigation, material transformation, reusable tool dependency, shared energy dependency, long tracker overflow, a deep subassembly, grouped complexity, and return from a shared dependency. Confirm parts/tools/steps retain their labeled roles and visual grammar. No extra component screens have been authored from these notes.
