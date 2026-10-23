const step=(title,copy,links,action,tools=[],detail='')=>({title,copy,links,action,tools,detail:detail||copy});
export const routes={
 speaker:{label:'Speaker',role:'Part',model:'speaker',title:'A tiny engine<br>for sound.',intro:'Scroll. See the tools work.<br>Follow a part into its own story.',steps:[
 step('Build the fixed magnetic system.','An alignment fixture locates the magnet and iron flux parts in the frame. Their faces leave a clear magnetic gap.',['magnet','iron','frame','alignment'],'The fixture locates the fixed system.',['alignment'],'The permanent magnet supplies the field. Soft iron guides its flux across the air gap. These fixed parts do not vibrate with the coil.'),
 step('Join the coil and membrane.','An applicator places adhesive along the coil’s upper edge. The membrane meets that bond and the pair become one moving assembly.',['coil','membrane','adhesive','applicator'],'Adhesive joins coil to membrane.',['applicator'],'The insulated copper voice coil must move with the membrane. The compliant surround allows travel; the outer edge will later remain fixed.'),
 step('Center it, then seal the edge.','The alignment fixture holds the coil clear of the iron gap. The applicator seals the surround to the frame, keeping the moving gap free.',['alignment','applicator','adhesive'],'Centered in the gap. Bond only at the edge.',['alignment','applicator'],'The coil must be centered within the magnetic air gap without rubbing. Adhesive belongs at the designed bonds, not between the moving coil and fixed iron.'),
 step('Connect, drive, and measure.','A meter checks continuity. A powered audio signal source and amplifier drive the coil; a measurement microphone checks its sound.',['meter','signal','amplifier','microphone','power'],'Meter → audio drive → microphone check.',['meter','signal','amplifier','microphone','power'],'A meter checks DC resistance and continuity. An audio signal source and amplifier need a power source to supply changing coil current. Check free movement, rub-buzz, and acoustic response. The microphone is a separate measurement tool.')
 ]},
 phone:{label:'Phone',role:'Part',model:'phone',title:'Give the sound<br>a home.',intro:'A regular parent journey.<br>Scroll to place the speaker in the phone.',standIn:true,tbd:true,steps:[
 step('Start with the phone shell.','The shell provides places for the phone’s systems. This sample diagram shows an outline, not a complete phone specification.',['phone-shell'],'A shell sets the assembly context.'),
 step('Fit the sound module.','Bring the finished Speaker into its place in the phone. Open it to follow the same scroll making journey.',['speaker'],'The finished Speaker returns into Phone.'),
 step('Bring the systems together.','Connect and check the systems as a whole. Other phone subsystems are represented by this stand-in diagram.',['speaker','meter'],'Phone context · other systems are TBD.',['meter'])
 ]},
 coil:{label:'Copper voice coil',role:'Part',model:'coil',title:'A loop that<br>makes motion.',intro:'Wire, a forming tool, and a light bond.<br>Scroll to make the coil.',standIn:true,steps:[
 step('Start with insulated wire.','Copper carries current. Its insulating coating keeps neighboring turns apart as the wire becomes a loop.',['wire'],'Two materials. One useful coil input.'),
 step('Wind around the fixture.','The winding fixture holds a rounded rectangular form. As it turns, wire follows the mandrel and builds the winding.',['winding','wire'],'The fixture turns; the winding grows.',['winding']),
 step('Secure the winding.','An adhesive applicator bonds the turns so the light coil keeps its shape when released from the fixture.',['applicator','adhesive'],'The applicator secures the turns.',['applicator']),
 step('Check its electrical path.','A meter checks continuity and the intended resistance. Check the outline against the speaker’s gap before returning the coil.',['meter','alignment'],'A finished coil returns to the Speaker.',['meter'])
 ]},
 wire:{label:'Insulated wire',role:'Part',model:'wire',title:'Two materials.<br>One useful wire.',intro:'Follow the copper core beneath its coat.<br>Scroll to make the input.',standIn:true,steps:[
 step('Form the copper conductor.','A drawing die controls the conductor’s outline. The copper remains the electrical core of this wire.',['copper-stock','drawing-die'],'A forming tool controls the strand.',['drawing-die']),
 step('Apply an insulating coat.','A coating applicator surrounds the copper with a thin insulating layer. Adjacent turns can then stay electrically separate.',['coating-applicator','insulating-coat'],'The cyan coat surrounds the copper core.',['coating-applicator']),
 step('Check core and coating.','Check conductor continuity and insulating-coat integrity. The completed wire returns to the coil’s material-input step.',['meter'],'Finished wire returns into the coil.',['meter'])
 ]},
 winding:{label:'Winding fixture',role:'Tool',model:'fixture',title:'Make the tool<br>that holds the form.',intro:'Its own parts have their own making story.<br>Its use belongs in the coil journey.',standIn:true,steps:[
 step('Shape the mandrel.','A metalworking tool shapes the rounded center form that will define the coil’s outline.',['mandrel','metalworking'],'A formed mandrel defines the winding path.'),
 step('Mount the form and supports.','Join the mandrel, shaft, supports and rigid base. They locate the winding form without becoming speaker parts.',['mandrel','shaft','supports','base'],'The tool’s own parts come together.'),
 step('Check alignment and release.','A dimensional gauge checks the form. Confirm that a winding can be released while keeping its shape.',['gauge'],'The finished tool returns to the winding step.')
 ]},
 alignment:{label:'Alignment fixture',role:'Tool',model:'alignment',title:'Make a guide<br>for the narrow gap.',intro:'A tool has its own parts and making steps.<br>Return it to the calling assembly step.',standIn:true,steps:[
 step('Make the reference frame.','Form a rigid reference frame around the speaker outline. Metalworking tools shape its locating surfaces.',['base','metalworking'],'Prepare the locating frame.'),
 step('Add locating supports.','Attach the supports that locate the fixed and moving assemblies without sealing the moving gap.',['supports','base'],'Supports join the reference frame.'),
 step('Check the clearances.','A dimensional gauge checks the references and clearance. The tool returns to the step that needs it.',['gauge'],'A finished guide returns to the work.')
 ]},
 magnet:{label:'Magnet',role:'Part',model:'magnet',title:'Make the fixed<br>magnetic field.',intro:'Conceptual magnet making.<br>The actual material and process are TBD.',standIn:true,tbd:true,steps:[
 step('Choose magnetic material.','Prepare a suitable magnetic-material input. Its composition and process depend on the design.',['magnetic-material'],'A material input is a Part.'),
 step('Form the magnet body.','A forming press shapes the intended body. Its tooling and material process are separate dependencies.',['press'],'The press forms the body.'),
 step('Consolidate and finish.','A suitable material process consolidates the body; finishing tools establish the needed surfaces.',['furnace','metalworking'],'Material-specific processing is TBD.'),
 step('Magnetize and check.','A magnetizer establishes the magnetization; a field-checking tool verifies it.',['magnetizer','field-meter'],'Return the finished magnet to Speaker.')
 ]},
 iron:{label:'Iron flux parts',role:'Part',model:'iron',title:'Give the field<br>a fixed path.',intro:'Pole and return surfaces guide flux.<br>Scroll through a conceptual making path.',standIn:true,steps:[
 step('Prepare iron stock.','Start with suitable iron stock for the pole and return path. The stock is a physical input Part.',['iron-stock'],'Prepared stock becomes the flux path.'),
 step('Shape pole and return surfaces.','Metalworking tools form the pole and return surfaces around the moving coil’s gap.',['metalworking'],'Tools establish the fixed gap geometry.'),
 step('Finish and check the gap faces.','Finish the facing surfaces and check their dimensions with a gauge before returning the iron parts.',['gauge'],'Checked iron returns to the fixed system.')
 ]},
 membrane:{label:'Membrane + surround',role:'Part',model:'membrane',title:'Make a surface<br>that can move air.',intro:'A conceptual diaphragm and flexible edge.<br>Materials and dimensions are TBD.',standIn:true,steps:[
 step('Prepare the thin material.','Prepare the thin membrane material and a compliant surround input.',['film-stock'],'A light moving surface starts with Parts.'),
 step('Form the membrane and edge.','A forming tool shapes the central membrane and flexible surround.',['forming-tool'],'The formed edge allows movement.'),
 step('Check shape and compliance.','Check shape, free movement and the bond surfaces before returning it to the coil-joining step.',['gauge'],'The membrane returns to the moving assembly.')
 ]},
 frame:{label:'Frame + rear chamber',role:'Part',model:'frame',title:'Make the support<br>around the sound.',intro:'A metal frame and an acoustic rear volume.<br>Scroll through this stand-in making path.',standIn:true,steps:[
 step('Prepare the frame stock.','Prepare the metal input for the frame and rear chamber.',['metal-stock'],'Stock is the physical input.'),
 step('Form the support and chamber.','Metalworking tools form the support surfaces and chamber volume.',['metalworking'],'The frame supports fixed and moving edges.'),
 step('Check mounting and seals.','Check the mounting faces, rear volume and sealing surfaces with a dimensional gauge.',['gauge'],'The frame returns to the fixed-system step.')
 ]},
 applicator:{label:'Adhesive applicator',role:'Tool',model:'applicator',title:'Make a tool<br>for a small bond.',intro:'Its making is separate from applying adhesive.<br>Scroll to assemble the tool.',standIn:true,steps:[
 step('Make body and reservoir.','Form the body and reservoir that hold and guide the adhesive input.',['casing','forming-tool'],'The applicator body is made first.'),
 step('Fit nozzle and feed parts.','Fit the nozzle and feed mechanism to the tool body.',['nozzle','shaft'],'Tool parts establish controlled delivery.'),
 step('Check controlled delivery.','Check the tool’s delivery and access before returning it to the bond being made.',['gauge'],'The applicator returns to its caller.')
 ]},
 meter:{label:'Meter',role:'Tool',model:'meter',title:'Make the tool<br>that checks the path.',intro:'A meter is its own manufactured item.<br>Continuity checking happens in its caller.',standIn:true,steps:[
 step('Make enclosure and board.','Prepare a case and measuring circuit board as separate input Parts.',['casing','board'],'Parts form the measuring tool.'),
 step('Fit display, leads and terminals.','Fit the display and electrical leads to the measuring circuit and case.',['display','wire','terminals'],'The meter’s own parts are joined.'),
 step('Power and verify the meter.','Fit a power source and verify the measuring function before the tool returns to its caller.',['power','reference'],'A checked Meter returns to the test step.')
 ]},
 signal:{label:'Audio signal source',role:'Tool',model:'signal',title:'Make a source<br>for the audio signal.',intro:'Signal generation has its own dependencies.<br>Using the signal belongs in the test step.',standIn:true,steps:[
 step('Prepare the signal circuit.','Prepare a waveform-generating circuit and its controls as input Parts.',['board','controls'],'The circuit establishes the signal.'),
 step('Fit enclosure and output.','Mount the circuit in a case and connect its output terminals.',['casing','terminals'],'The tool receives an output path.'),
 step('Power and check the waveform.','A power source supplies the circuit. Verify the output before returning the signal source.',['power','meter'],'The audio source returns to the speaker test.')
 ]},
 amplifier:{label:'Audio amplifier',role:'Tool',model:'amplifier',title:'Make the tool<br>that drives the coil.',intro:'The audio amplifier needs a real power source.<br>Scroll through its own making path.',standIn:true,steps:[
 step('Prepare input and output stages.','Prepare the circuit input and power-output stages as Parts.',['board'],'A circuit receives and amplifies the signal.'),
 step('Add support and terminals.','Mount the circuit, thermal support and connection terminals.',['casing','heat-sink','terminals'],'Support parts join the circuit.'),
 step('Supply power and verify output.','Use a power source and checked audio signal source to verify the amplifier’s output.',['power','signal','meter'],'The amplifier returns to drive the coil.')
 ]},
 microphone:{label:'Measurement microphone',role:'Tool',model:'microphone',title:'Make the tool<br>that measures sound.',intro:'Its capsule and body are physical Parts.<br>Its use belongs in the acoustic check.',standIn:true,steps:[
 step('Prepare the sensing capsule.','Prepare the sound-sensing capsule as a Part. Its exact transducer construction is TBD.',['capsule'],'The capsule is the sensing Part.'),
 step('Fit body and electrical path.','Mount the capsule in a body and connect its signal path.',['casing','wire','terminals'],'Body and signal connections join the capsule.'),
 step('Verify the microphone.','Use a checked audio signal and drive system to verify measurement response before return.',['signal','amplifier','power'],'The microphone returns to the acoustic test.')
 ]},
 power:{label:'Power source',role:'Tool',model:'power',title:'Make a source<br>of electrical power.',intro:'A generator concept needs mechanical input.<br>Magnets alone do not supply energy.',standIn:true,steps:[
 step('Make the magnetic system.','Prepare a fixed magnetic system around the intended moving winding.',['magnet','iron'],'Fixed magnetic Parts establish the field.'),
 step('Fit winding and shaft.','Join an insulated winding and shaft. Mechanical input must turn or move the electromagnetic system.',['wire','shaft'],'Mechanical input drives the shaft.'),
 step('Add output conditioning.','Add output connections and a conditioning circuit appropriate to the load.',['board','terminals'],'The output needs a defined electrical path.'),
 step('Measure the supplied output.','Supply mechanical input, then use a meter to verify electrical output before returning this tool.',['meter'],'Mechanical input → measured electrical output.')
 ]},
 adhesive:{label:'Adhesive',role:'Part',model:'adhesive',title:'Prepare the Part<br>that makes the bond.',intro:'A material input has its own prerequisites.<br>This stand-in keeps them visible.',standIn:true,tbd:true,steps:[
 step('Prepare material inputs.','Select compatible adhesive ingredients for the intended bond. Chemistry and processing are TBD.',['adhesive-ingredients'],'The material recipe is TBD.'),
 step('Process and package the material.','A suitable processing tool prepares the material and packages it for the applicator.',['processing-tool'],'Processing tools make the material input.'),
 step('Check the intended bond.','Check compatibility and bond performance before using the material in assembly.',['gauge'],'Adhesive returns as a Part input.')
 ]}
};
export function getRoute(id){if(routes[id])return routes[id];const tools=['drawing-die','coating-applicator','metalworking','gauge','press','furnace','magnetizer','field-meter','forming-tool','processing-tool'];const role=tools.includes(id)?'Tool':'Part';const label=id.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ');return routes[id]={label,role,model:role==='Tool'?'fixture':'board',title:`Make the<br>${label.toLowerCase()}.`,intro:'The same scroll journey, at another depth.<br>Detailed geometry and process are TBD.',standIn:true,tbd:true,steps:[step('Prepare its input parts.',`Prepare the physical input Parts for ${label.toLowerCase()}. This sample path keeps their making dependencies explicit.`,['metal-stock'],'Input Parts prepare the making path.'),step('Form and join the working features.','Use fabrication tools to form and join the working features. The process diagram remains TBD.',[id==='metalworking'?'press':'metalworking'],'A stand-in making action is shown.'),step('Check the completed item.',`Check the intended geometry and function before returning ${label.toLowerCase()} to its caller.`,['gauge'],'The completed item returns to its caller.')]};}

