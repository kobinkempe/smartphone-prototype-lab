// Content contract: Part/Tool are the only roles. Every child is a native making
// level. Runtime navigation must use a caller stack; parent is a fallback only.
// Tool use belongs to the current caller instruction; Tool steps describe making.
const step = (id, title, instruction, parts = [], tools = [], focus = id) =>
  ({ id, title, instruction, parts, tools, focus });

const boundary = (id, title, summary, parent = 'speaker') => ({
  id, title, role: 'Part', status: 'stand-in', parent, summary,
  kicker: 'Material boundary',
  note: 'Conceptual input. Collection, chemistry and quality controls are condensed at this boundary.',
  steps: [step('prepare', `Prepare ${title.toLowerCase()}`, summary)]
});

const makeTool = (id, title, summary, parts, parent = 'speaker', tools = ['hand-drill', 'screwdriver']) => ({
  id, title, role: 'Tool', status: 'stand-in', parent, summary,
  kicker: 'Make the tool',
  note: 'Conceptual fabrication stand-in. Exact dimensions, calibration and production equipment are omitted.',
  steps: [
    step('build', 'Build the working assembly', summary, parts, tools),
    step('check', 'Check the finished tool', 'Check the assembly against a known reference before returning to the step that uses it.')
  ]
});

export const catalog = {
  phone: {
    id: 'phone', title: 'Smartphone', role: 'Part', status: 'stand-in',
    parent: null, kicker: 'From raw materials to a working object',
    summary: 'Build the phone by making the Parts it contains and the Tools that shape and test them.',
    note: 'A conceptual assembly map. The first detailed slice is the speaker; other components are native stand-ins.',
    steps: [
      step('body', 'Shape the body', 'Use the assembly fixture to hold the frame and seat the display.', ['phone-frame', 'display'], ['alignment-jig'], 'body'),
      step('core', 'Install the electrical core', 'Place the logic board and cell in the frame. Use the meter to verify connections before powering the assembly.', ['logic-board', 'battery'], ['meter'], 'core'),
      step('sound', 'Add sound', 'Seat the speaker in its acoustic opening and connect it to the board. Make the speaker by zooming into its Part.', ['speaker'], ['alignment-jig'], 'speaker')
    ]
  },
  speaker: {
    id: 'speaker', title: 'Speaker', role: 'Part', status: 'conceptual',
    parent: 'phone', kicker: 'Electrical motion becomes sound',
    summary: 'A current-carrying copper coil moves in a magnetic field and drives a light diaphragm.',
    note: 'Conceptual moving-coil speaker. Miniature phone speakers use tightly controlled clearances and specialised materials.',
    steps: [
      step('magnet', 'Form the magnetic gap', 'Use the alignment jig to seat the permanent magnet and separate iron pole and return yoke in the frame. These iron flux pieces concentrate the field around a narrow gap.', ['speaker-frame', 'magnet', 'iron-pole'], ['alignment-jig'], 'magnet'),
      step('coil', 'Bond coil to diaphragm', 'Use the alignment jig to hold the insulated copper voice coil and former square to the diaphragm while the compatible adhesive joins them. The winding remains electrically insulated.', ['voice-coil', 'diaphragm', 'bonding-film'], ['alignment-jig'], 'coil'),
      step('surround', 'Centre, suspend and seal', 'Use the alignment jig to centre the coil within the magnetic air gap without contact. Apply adhesive to bond the compliant surround to the diaphragm and frame, sealing the rear chamber while keeping the diaphragm free to move.', ['surround', 'bonding-film', 'speaker-frame'], ['alignment-jig'], 'surround'),
      step('test', 'Connect and test sound', 'Connect the coil leads and use the meter to check continuity. Feed an audio signal through the amplifier, power the test circuit with the power source, and use the measurement microphone to compare the sound response. Testing is conceptual; no measured result is claimed.', [], ['meter', 'audio-signal', 'amplifier', 'power-source', 'microphone'], 'test')
    ]
  },
  'voice-coil': {
    id: 'voice-coil', title: 'Copper voice coil', label: 'Voice coil',
    role: 'Part', status: 'stand-in', parent: 'speaker', kicker: 'Make the moving winding',
    summary: 'Wind insulated copper wire around a light former and keep the turns stable.',
    note: 'Conceptual winding. Turn count, wire size, adhesive, thermal limits and magnetic-gap fit need a chosen speaker design.',
    steps: [
      step('mount', 'Mount the former', 'Fit the coil former onto the winding fixture. Its surface sets the winding diameter.', ['coil-former'], ['winding-fixture'], 'coil'),
      step('wind', 'Wind the copper', 'Use the winding fixture to guide insulated wire into even turns under controlled tension. Keep the wire insulation intact.', ['insulated-wire'], ['winding-fixture'], 'coil'),
      step('finish', 'Secure and check the winding', 'Fix the turns with a compatible bonding film. Use the meter to check continuity and winding resistance; inspect the wire for damaged insulation.', ['bonding-film'], ['meter'], 'coil')
    ]
  },
  'insulated-wire': {
    id: 'insulated-wire', title: 'Insulated copper wire', label: 'Insulated wire',
    role: 'Part', status: 'stand-in', parent: 'voice-coil', kicker: 'A conductor with a thin insulating skin',
    summary: 'Draw clean copper to a fine conductor, then apply and cure a thin electrical insulation.',
    note: 'Industrial enamelling stand-in. Annealing, coating thickness, cure chemistry and defect checks are condensed.',
    steps: [
      step('conductor', 'Prepare the conductor', 'Use the draw plate to reduce the copper conductor in stages. Controlled annealing restores flexibility between drawing stages.', ['copper-conductor'], ['draw-plate', 'furnace'], 'wire'),
      step('coat', 'Insulate the wire', 'Use the coating line to apply thin polymer layers and cure them. Inspect the surface and insulation before winding.', ['insulating-polymer'], ['coating-line'], 'wire')
    ],
    sources: ['wire']
  },
  'winding-fixture': {
    id: 'winding-fixture', title: 'Winding fixture', role: 'Tool', status: 'stand-in',
    parent: 'voice-coil', kicker: 'Make the tool',
    summary: 'Build a rotating mandrel, rigid support and adjustable wire guide.',
    note: 'Conceptual hand-driven fixture. This page fabricates it; the coil step explains how to use it.',
    steps: [
      step('base', 'Make the rigid support', 'Use the milling machine to shape the support base and shaft seats, and the hand drill to make mounting holes. Keep the shaft axis straight.', ['wood-stock', 'steel-blank'], ['milling-machine', 'hand-drill'], 'fixture'),
      step('guide', 'Fit the mandrel and guide', 'Fit the mandrel to the shaft and use the screwdriver to attach a wire guide with a gentle tension pad. The mandrel must release the finished coil.', ['mandrel', 'guide-pad'], ['screwdriver'], 'fixture'),
      step('check', 'Check rotation and release', 'Turn the empty fixture. Check smooth rotation, a clear wire path and a removable mandrel before returning to coil winding.', [], [], 'fixture')
    ]
  },
  magnet: {
    id: 'magnet', title: 'Permanent magnet', role: 'Part', status: 'stand-in', parent: 'speaker',
    kicker: 'Magnetic material', summary: 'Shape a magnetic material and establish its permanent field.',
    note: 'Manufacturing boundary. Ferrite and rare-earth magnets have different feedstocks and processes; a phone magnet is not made by simply heating iron.',
    steps: [step('make', 'Make the magnetic body', 'Process the selected magnetic powder into a stable body, then magnetise it with the magnetising fixture.', ['magnetic-powder'], ['furnace', 'magnetising-fixture'], 'magnet')]
  },
  'iron-pole': {
    id: 'iron-pole', title: 'Iron flux pieces', role: 'Part', status: 'stand-in', parent: 'speaker',
    kicker: 'Shape the field path', summary: 'Shape low-carbon iron or steel into a pole and return yoke that guide magnetic flux.',
    note: 'Conceptual magnetic circuit part. The magnet and iron remain separate Parts.',
    steps: [step('shape', 'Shape the pole and yoke', 'Use the milling machine to shape the separate iron pieces and check the gap-facing surfaces for alignment.', ['iron-stock'], ['milling-machine'], 'magnet')]
  },
  'speaker-frame': {
    id: 'speaker-frame', title: 'Frame and rear chamber', label: 'Frame / rear chamber', role: 'Part', status: 'stand-in', parent: 'speaker',
    kicker: 'Rigid acoustic body', summary: 'Shape a rigid body with seats for the magnetic circuit and a controlled rear air volume.',
    note: 'Fabrication stand-in. Chamber volume, vents and sealing depend on the chosen miniature speaker design.',
    steps: [step('shape', 'Shape the body and seats', 'Use the milling machine to form the frame, magnetic seats and rear chamber. Check the sealing rim and mounting faces.', ['metal-stock'], ['milling-machine'], 'surround')]
  },
  diaphragm: {
    id: 'diaphragm', title: 'Diaphragm', role: 'Part', status: 'stand-in', parent: 'speaker',
    kicker: 'A light moving surface', summary: 'Form a thin membrane that moves air while staying light and stiff enough for the design.',
    note: 'Material and forming-process stand-in. This membrane is distinct from its compliant surround.',
    steps: [step('form', 'Form the membrane', 'Shape the polymer film with the forming die and preserve a clean coil attachment area.', ['polymer-film'], ['forming-die'], 'surround')]
  },
  surround: {
    id: 'surround', title: 'Compliant surround', label: 'Surround', role: 'Part', status: 'stand-in', parent: 'speaker',
    kicker: 'Flexible suspension', summary: 'Form the compliant rim that supports the diaphragm and allows its movement.',
    note: 'Conceptual suspension stand-in. Stiffness, damping and sealing determine the response.',
    steps: [step('form', 'Form the flexible rim', 'Shape elastomer into a compliant rim using the forming die. Keep the attachment edges even.', ['elastomer'], ['forming-die'], 'surround')]
  },
  'alignment-jig': makeTool('alignment-jig', 'Alignment jig', 'Use the milling machine and hand drill to shape a stable support and concentric guides that hold the parts at the intended gap and height.', ['wood-stock', 'steel-blank'], 'speaker', ['milling-machine', 'hand-drill']),
  meter: {
    id: 'meter', title: 'Electrical meter', label: 'Meter', role: 'Tool', status: 'stand-in', parent: 'speaker',
    kicker: 'Make the tool', summary: 'Combine a measurement circuit, probes and a readable output in an insulated housing.',
    note: 'Measurement electronics stand-in. Calibration against a known reference is required; this is not a buildable instrument schematic.',
    steps: [step('build', 'Build the measurement assembly', 'Use the screwdriver to mount the measurement circuit in its housing and the soldering iron to attach insulated probe leads.', ['measurement-circuit', 'insulated-wire', 'polymer-film'], ['screwdriver', 'soldering-iron']), step('calibrate', 'Calibrate the reading', 'Compare the output with a known electrical reference before using it to judge another component.')]
  },
  'audio-signal': makeTool('audio-signal', 'Audio signal source', 'Use the screwdriver to mount the oscillator circuit with its frequency control, and the soldering iron to connect its output.', ['oscillator-circuit', 'insulated-wire', 'polymer-film'], 'speaker', ['screwdriver', 'soldering-iron']),
  amplifier: makeTool('amplifier', 'Test amplifier', 'Use the screwdriver to mount the amplifier circuit and heat path, and the soldering iron to connect its input and output.', ['amplifier-circuit', 'metal-stock', 'insulated-wire'], 'speaker', ['screwdriver', 'soldering-iron']),
  microphone: makeTool('microphone', 'Measurement microphone', 'Use the screwdriver to mount the acoustic sensor, readout circuit and sound inlet, and the soldering iron to connect its leads.', ['acoustic-sensor', 'measurement-circuit', 'polymer-film'], 'speaker', ['screwdriver', 'soldering-iron']),
  'power-source': {
    id: 'power-source', title: 'Power source', role: 'Tool', status: 'stand-in', parent: 'speaker',
    kicker: 'Make the tool', summary: 'Build a hand-driven generator source and add control of its output.',
    note: 'Conceptual power Tool. Turning supplies mechanical energy; a magnet alone does not supply continuous power. Output regulation is a separate assembly.',
    steps: [
      step('generator', 'Build the generator assembly', 'Use the hand drill for mounting holes and the screwdriver to secure the generator assembly on a rigid base. Connect its output leads with the soldering iron.', ['generator-assembly', 'wood-stock', 'insulated-wire'], ['hand-drill', 'screwdriver', 'soldering-iron'], 'generator'),
      step('regulate', 'Control and verify the output', 'Fit the output-control circuit and check the resulting supply with the meter before connecting the test circuit.', ['output-control'], ['meter'], 'generator')
    ], sources: ['generator']
  },
  'generator-assembly': {
    id: 'generator-assembly', title: 'Generator assembly', label: 'Generator', role: 'Part', status: 'stand-in', parent: 'power-source',
    kicker: 'Changing magnetic flux', summary: 'Combine a coil, magnet and rotating support so movement changes the magnetic flux through the coil.',
    note: 'Physics stand-in. Bearing geometry, waveform, electrical losses and rectification are omitted.',
    steps: [step('build', 'Arrange the moving field', 'Use the hand drill and screwdriver to mount the generator coil and magnet on separate fixed and moving supports. Provide a crank so mechanical work drives the motion.', ['generator-coil', 'magnet', 'steel-blank'], ['hand-drill', 'screwdriver'], 'generator')], sources: ['generator']
  },
  'generator-coil': {
    id: 'generator-coil', title: 'Generator coil', role: 'Part', status: 'stand-in', parent: 'generator-assembly',
    kicker: 'A stationary winding', summary: 'Wind an insulated conductor into the coil used by the generator.',
    note: 'Conceptual coil. Shape, turns and conductor size differ from the speaker voice coil.',
    steps: [step('wind', 'Wind and secure the coil', 'Use the winding fixture to guide the insulated wire around its former and secure the turns.', ['insulated-wire', 'coil-former', 'bonding-film'], ['winding-fixture'], 'coil')]
  },
  'milling-machine': {
    id: 'milling-machine', title: 'Milling machine', role: 'Tool', status: 'stand-in', parent: 'speaker-frame',
    kicker: 'Make the tool', summary: 'Combine a rigid machine frame, controlled motion stage, spindle and cutting tool.',
    note: 'Industrial equipment stand-in. Precision machine production requires further tooling and metrology; this is a module map.',
    steps: [step('build', 'Assemble the machining modules', 'Use the hand drill and screwdriver to join the frame, motion stage and spindle modules. Use the alignment jig to establish their relative axes.', ['machine-frame', 'motion-stage', 'spindle', 'milling-cutter'], ['hand-drill', 'screwdriver', 'alignment-jig'], 'fixture'), step('check', 'Verify the machine alignment', 'Check rigidity, axis motion and cutting-tool alignment against known dimensional references before returning to machining.', [], [], 'fixture')]
  },
  'hand-drill': makeTool('hand-drill', 'Hand drill', 'Fit a drill bit to a hand-driven shaft and bearing support. Use the metal file to finish the fitted surfaces.', ['drill-bit', 'steel-blank', 'wood-stock'], 'winding-fixture', ['metal-file']),
  screwdriver: makeTool('screwdriver', 'Screwdriver', 'Use the metal file to shape a metal tip, then fit its shaft into an insulating handle.', ['steel-blank', 'wood-stock'], 'winding-fixture', ['metal-file']),
  'metal-file': makeTool('metal-file', 'Metal file', 'Form cutting teeth on a steel blank and heat-treat them in the controlled furnace. Fit the hardened blank to a handle.', ['steel-blank', 'wood-stock'], 'hand-drill', ['furnace']),
  'abrasive-stone': {
    id: 'abrasive-stone', title: 'Abrasive stone', role: 'Tool', status: 'stand-in', parent: 'draw-plate',
    kicker: 'Make the tool', summary: 'Select and prepare an abrasive stone with a stable working surface.',
    note: 'Conceptual abrasive Tool. Grain size and flatness depend on the surface being finished.',
    steps: [step('prepare', 'Prepare the abrasive surface', 'Select sound abrasive stone and prepare a stable working face.', ['stone'], [], 'fixture')]
  },
  'soldering-iron': makeTool('soldering-iron', 'Soldering iron', 'Use the screwdriver to mount a copper tip and controlled heating element inside a heat-resistant insulated handle.', ['copper-tip', 'heating-element', 'insulating-handle'], 'meter', ['screwdriver']),
  'draw-plate': makeTool('draw-plate', 'Wire draw plate', 'Use the milling machine to form drawing holes in a hard blank and the abrasive stone to finish the accessible guide surfaces.', ['hard-die-blank', 'metal-stock'], 'insulated-wire', ['milling-machine', 'abrasive-stone']),
  furnace: makeTool('furnace', 'Controlled furnace', 'Build an insulated chamber, heating element and temperature-control assembly.', ['refractory-body', 'heating-element', 'temperature-control'], 'insulated-wire'),
  'coating-line': makeTool('coating-line', 'Wire coating line', 'Build a wire guide, thin-film applicator and controlled curing section.', ['metal-stock', 'guide-pad', 'temperature-control'], 'insulated-wire'),
  'forming-die': makeTool('forming-die', 'Forming die', 'Use the milling machine to shape matching forming surfaces that support the membrane or flexible rim without tearing it.', ['metal-stock'], 'diaphragm', ['milling-machine']),
  'magnetising-fixture': makeTool('magnetising-fixture', 'Magnetising fixture', 'Use the screwdriver to mount a field coil, pulse-control assembly and secure work support; connect the circuit with the soldering iron.', ['generator-coil', 'pulse-control', 'metal-stock'], 'magnet', ['screwdriver', 'soldering-iron']),

  'phone-frame': boundary('phone-frame', 'Phone frame', 'Form and finish the structural body with accurate seats for the components.', 'phone'),
  display: boundary('display', 'Display', 'Combine a patterned light-emitting or light-modulating stack, electrical contacts and a protective front layer.', 'phone'),
  'logic-board': boundary('logic-board', 'Logic board', 'Combine patterned conductors, packaged chips and connectors into the phone electrical core.', 'phone'),
  battery: boundary('battery', 'Rechargeable cell', 'Combine electrodes, electrolyte, separator and protection into a controlled energy-storage assembly.', 'phone'),
  'copper-conductor': boundary('copper-conductor', 'Copper conductor', 'Prepare clean copper stock suitable for wire drawing. Ore processing and refining are condensed in this first slice.', 'insulated-wire'),
  'coil-former': boundary('coil-former', 'Coil former', 'Form a thin, light cylindrical support for the winding.', 'voice-coil'),
  'bonding-film': boundary('bonding-film', 'Bonding adhesive', 'Prepare an adhesive or bonding film compatible with the coil insulation, diaphragm, surround and frame.', 'voice-coil'),
  'insulating-polymer': boundary('insulating-polymer', 'Insulating polymer', 'Prepare a wire-enamel system compatible with the wire and its curing process.', 'insulated-wire'),
  'wood-stock': boundary('wood-stock', 'Wood stock', 'Select and dry a rigid piece of wood suitable for the support.', 'winding-fixture'),
  'steel-blank': boundary('steel-blank', 'Steel blank', 'Prepare metal stock for shafts and rigid guides.', 'winding-fixture'),
  mandrel: boundary('mandrel', 'Removable mandrel', 'Shape a smooth winding surface that can release the finished coil.', 'winding-fixture'),
  'guide-pad': boundary('guide-pad', 'Wire guide and pad', 'Prepare a smooth guide and compliant pad for controlled wire tension.', 'winding-fixture'),
  'magnetic-powder': boundary('magnetic-powder', 'Magnetic powder', 'Prepare the selected ferrite or rare-earth magnetic feedstock.', 'magnet'),
  'iron-stock': boundary('iron-stock', 'Low-carbon iron stock', 'Prepare iron or low-carbon steel suitable for the intended magnetic circuit.', 'iron-pole'),
  'polymer-film': boundary('polymer-film', 'Polymer film', 'Prepare a uniform polymer sheet for the selected enclosure or membrane process.', 'diaphragm'),
  elastomer: boundary('elastomer', 'Elastomer', 'Prepare a flexible material with the intended stiffness and damping.', 'surround'),
  'measurement-circuit': boundary('measurement-circuit', 'Measurement circuit', 'Fabricate a sensing and readout circuit with a known measurement range.', 'meter'),
  'oscillator-circuit': boundary('oscillator-circuit', 'Oscillator circuit', 'Fabricate a circuit that generates a controlled electrical test waveform.', 'audio-signal'),
  'amplifier-circuit': boundary('amplifier-circuit', 'Amplifier circuit', 'Fabricate a circuit that can deliver the required signal current into the speaker load.', 'amplifier'),
  'acoustic-sensor': boundary('acoustic-sensor', 'Acoustic sensor', 'Fabricate a sound-sensitive transducer and its electrical contacts.', 'microphone'),
  'output-control': boundary('output-control', 'Output-control circuit', 'Fabricate the conversion and regulation assembly required by the chosen generator output and load.', 'power-source'),
  'metal-stock': boundary('metal-stock', 'Metal stock', 'Prepare rigid stock for the selected structural or heat-transfer part.', 'speaker-frame'),
  stone: boundary('stone', 'Working stone', 'Select sound stone with properties suited to the intended tool.', 'abrasive-stone'),
  'plant-fibre': boundary('plant-fibre', 'Plant fibre', 'Collect and prepare strong fibres for a tight binding.', 'hand-drill'),
  'machine-frame': boundary('machine-frame', 'Machine frame', 'Fabricate a rigid machine structure with mounting references for the motion and spindle modules.', 'milling-machine'),
  'motion-stage': boundary('motion-stage', 'Motion stage', 'Fabricate the bearing, drive and positioning assembly for the machine axes.', 'milling-machine'),
  spindle: boundary('spindle', 'Spindle module', 'Fabricate a rotating shaft, bearings and drive with the required cutting-tool mount.', 'milling-machine'),
  'milling-cutter': boundary('milling-cutter', 'Milling cutter', 'Form and finish a hard cutting tool matched to the machining task.', 'milling-machine'),
  'drill-bit': boundary('drill-bit', 'Drill bit', 'Form and finish a cutting bit matched to the hole and material.', 'hand-drill'),
  'copper-tip': boundary('copper-tip', 'Soldering tip', 'Shape a copper-based tip and prepare its working surface for heat transfer and solder wetting.', 'soldering-iron'),
  'insulating-handle': boundary('insulating-handle', 'Insulating handle', 'Form a heat-resistant electrically insulating grip and internal supports.', 'soldering-iron'),
  'hard-die-blank': boundary('hard-die-blank', 'Hard die blank', 'Prepare a hard, wear-resistant blank for a drawing die.', 'draw-plate'),
  'refractory-body': boundary('refractory-body', 'Refractory body', 'Form a heat-resistant chamber and insulation suitable for the controlled process.', 'furnace'),
  'heating-element': boundary('heating-element', 'Heating element', 'Prepare a controlled heat source compatible with the furnace chamber.', 'furnace'),
  'temperature-control': boundary('temperature-control', 'Temperature controller', 'Fabricate a sensor and control circuit for the selected heating process.', 'furnace'),
  'pulse-control': boundary('pulse-control', 'Pulse-control assembly', 'Fabricate the controlled high-field pulse system needed to magnetise the selected material.', 'magnetising-fixture')
};

// Primary sources support the conceptual facts, not a buildable process recipe.
export const contentSources = {
  wire: { title: 'Elektrisola — enamelled wire production', url: 'https://www.elektrisola.com/en/Enamelled-Wire/Info' },
  copper: { title: 'Copper Development Association — refining', url: 'https://archive.copper.org/education/copper-production/6.php' },
  generator: { title: 'OpenStax — electric generators', url: 'https://openstax.org/books/college-physics/pages/23-5-electric-generators' },
  speaker: { title: 'JBL Professional — cone transducers', url: 'https://jblpro.com/en-US/product_families/cone-transducers.html' },
  lithography: { title: 'ASML — lenses and mirrors', url: 'https://www.asml.com/en/technology/lithography-principles/lenses-and-mirrors' },
  light: { title: 'ASML — light and lasers', url: 'https://www.asml.com/en/technology/lithography-principles/light-and-lasers' }
};

// Prepared scope only. Keep these journeys out of the catalog until the first
// Speaker component has been presented and the root authorises integration.
export const preparedDepth = {
  copper: {
    route: ['copper ore', 'ore preparation', 'refining', 'copper conductor', 'insulated wire'],
    tools: ['stone pick', 'separation equipment', 'furnace', 'refining cell', 'draw plate', 'coating line'],
    constraint: 'Choose an ore family first. Sulfide smelting/electrorefining and oxide leaching/electrowinning are different routes.',
    sources: ['copper', 'wire']
  },
  extraction: {
    route: ['working stone', 'wood handle', 'plant-fibre binding', 'stone pick'],
    constraint: 'A conceptual extraction Tool. It can demonstrate bootstrapping and accessible weathered material; it is not a substitute for mining machinery.'
  },
  lithography: {
    route: ['lithography equipment', 'optical module', 'positioning stage', 'light source', 'control and metrology'],
    constraint: 'An industrial stand-in split into modules. DUV lenses and EUV mirrors belong to different systems; raw silicon cannot become a phone chip in a few bench steps.',
    sources: ['lithography', 'light']
  }
};
