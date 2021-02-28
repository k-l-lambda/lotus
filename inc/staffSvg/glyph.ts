
import glyphHash from "./glyph-hash.json";



enum Glyph {
	"rests.0",
	"rests.1",
	"rests.0o",
	"rests.1o",
	"rests.M3",
	"rests.M2",
	"rests.M1",
	"rests.M1o",
	"rests.2",
	"rests.2classical",
	"rests.2z",
	"rests.3",
	"rests.4",
	"rests.5",
	"rests.6",
	"rests.7",
	"accidentals.sharp",
	"accidentals.sharp.arrowup",
	"accidentals.sharp.arrowdown",
	"accidentals.sharp.arrowboth",
	"accidentals.sharp.slashslash.stem",
	"accidentals.sharp.slashslashslash.stemstem",
	"accidentals.sharp.slashslashslash.stem",
	"accidentals.sharp.slashslash.stemstemstem",
	"accidentals.doublesharp",
	"accidentals.natural",
	"accidentals.natural.arrowup",
	"accidentals.natural.arrowdown",
	"accidentals.natural.arrowboth",
	"accidentals.flat",
	"accidentals.flat.arrowup",
	"accidentals.flat.arrowdown",
	"accidentals.flat.arrowboth",
	"accidentals.flat.slash",
	"accidentals.flat.slashslash",
	"accidentals.mirroredflat.flat",
	"accidentals.mirroredflat",
	"accidentals.mirroredflat.backslash",
	"accidentals.flatflat",
	"accidentals.flatflat.slash",
	"accidentals.rightparen",
	"accidentals.leftparen",
	"arrowheads.open.01",
	"arrowheads.open.0M1",
	"arrowheads.open.11",
	"arrowheads.open.1M1",
	"arrowheads.close.01",
	"arrowheads.close.0M1",
	"arrowheads.close.11",
	"arrowheads.close.1M1",
	"dots.dot",
	"scripts.ufermata",
	"scripts.dfermata",
	"scripts.ushortfermata",
	"scripts.dshortfermata",
	"scripts.ulongfermata",
	"scripts.dlongfermata",
	"scripts.uverylongfermata",
	"scripts.dverylongfermata",
	"scripts.thumb",
	"scripts.sforzato",
	"scripts.espr",
	"scripts.staccato",
	"scripts.ustaccatissimo",
	"scripts.dstaccatissimo",
	"scripts.tenuto",
	"scripts.uportato",
	"scripts.dportato",
	"scripts.umarcato",
	"scripts.dmarcato",
	"scripts.open",
	"scripts.halfopen",
	"scripts.halfopenvertical",
	"scripts.stopped",
	"scripts.upbow",
	"scripts.downbow",
	"scripts.reverseturn",
	"scripts.turn",
	"scripts.trill",
	"scripts.upedalheel",
	"scripts.dpedalheel",
	"scripts.upedaltoe",
	"scripts.dpedaltoe",
	"scripts.flageolet",
	"scripts.segno",
	"scripts.varsegno",
	"scripts.coda",
	"scripts.varcoda",
	"scripts.rcomma",
	"scripts.lcomma",
	"scripts.rvarcomma",
	"scripts.lvarcomma",
	"scripts.arpeggio",
	"scripts.trill_element",
	"scripts.arpeggio.arrow.M1",
	"scripts.arpeggio.arrow.1",
	"scripts.trilelement",
	"scripts.prall",
	"scripts.mordent",
	"scripts.prallprall",
	"scripts.prallmordent",
	"scripts.upprall",
	"scripts.upmordent",
	"scripts.pralldown",
	"scripts.downprall",
	"scripts.downmordent",
	"scripts.prallup",
	"scripts.lineprall",
	"scripts.caesura.curved",
	"scripts.caesura.straight",
	"scripts.tickmark",
	"scripts.snappizzicato",
	"clefs.C",
	"clefs.C_change",
	"clefs.varC",
	"clefs.varC_change",
	"clefs.F",
	"clefs.F_change",
	"clefs.G",
	"clefs.G_change",
	"clefs.GG",
	"clefs.GG_change",
	"clefs.tenorG",
	"clefs.tenorG_change",
	"clefs.percussion",
	"clefs.percussion_change",
	"clefs.varpercussion",
	"clefs.varpercussion_change",
	"clefs.tab",
	"clefs.tab_change",
	"timesig.C44",
	"timesig.C22",
	"pedal.*",
	"pedal.M",
	"pedal..",
	"pedal.P",
	"pedal.d",
	"pedal.e",
	"pedal.Ped",
	"brackettips.up",
	"brackettips.down",
	"accordion.discant",
	"accordion.dot",
	"accordion.freebass",
	"accordion.stdbass",
	"accordion.bayanbass",
	"accordion.oldEE",
	"accordion.push",
	"accordion.pull",
	"ties.lyric.short",
	"ties.lyric.default",
	"noteheads.uM2",
	"noteheads.dM2",
	"noteheads.sM1",
	"noteheads.sM1double",
	"noteheads.s0",
	"noteheads.s1",
	"noteheads.s2",
	"noteheads.s0diamond",
	"noteheads.s1diamond",
	"noteheads.s2diamond",
	"noteheads.s0triangle",
	"noteheads.d1triangle",
	"noteheads.u1triangle",
	"noteheads.u2triangle",
	"noteheads.d2triangle",
	"noteheads.s0slash",
	"noteheads.s1slash",
	"noteheads.s2slash",
	"noteheads.s0cross",
	"noteheads.s1cross",
	"noteheads.s2cross",
	"noteheads.s2xcircle",
	"noteheads.s0do",
	"noteheads.d1do",
	"noteheads.u1do",
	"noteheads.d2do",
	"noteheads.u2do",
	"noteheads.s0doThin",
	"noteheads.d1doThin",
	"noteheads.u1doThin",
	"noteheads.d2doThin",
	"noteheads.u2doThin",
	"noteheads.s0re",
	"noteheads.u1re",
	"noteheads.d1re",
	"noteheads.u2re",
	"noteheads.d2re",
	"noteheads.s0reThin",
	"noteheads.u1reThin",
	"noteheads.d1reThin",
	"noteheads.u2reThin",
	"noteheads.d2reThin",
	"noteheads.s0mi",
	"noteheads.s1mi",
	"noteheads.s2mi",
	"noteheads.s0miMirror",
	"noteheads.s1miMirror",
	"noteheads.s2miMirror",
	"noteheads.s0miThin",
	"noteheads.s1miThin",
	"noteheads.s2miThin",
	"noteheads.u0fa",
	"noteheads.d0fa",
	"noteheads.u1fa",
	"noteheads.d1fa",
	"noteheads.u2fa",
	"noteheads.d2fa",
	"noteheads.u0faThin",
	"noteheads.d0faThin",
	"noteheads.u1faThin",
	"noteheads.d1faThin",
	"noteheads.u2faThin",
	"noteheads.d2faThin",
	"noteheads.s0sol",
	"noteheads.s1sol",
	"noteheads.s2sol",
	"noteheads.s0la",
	"noteheads.s1la",
	"noteheads.s2la",
	"noteheads.s0laThin",
	"noteheads.s1laThin",
	"noteheads.s2laThin",
	"noteheads.s0ti",
	"noteheads.u1ti",
	"noteheads.d1ti",
	"noteheads.u2ti",
	"noteheads.d2ti",
	"noteheads.s0tiThin",
	"noteheads.u1tiThin",
	"noteheads.d1tiThin",
	"noteheads.u2tiThin",
	"noteheads.d2tiThin",
	"noteheads.u0doFunk",
	"noteheads.d0doFunk",
	"noteheads.u1doFunk",
	"noteheads.d1doFunk",
	"noteheads.u2doFunk",
	"noteheads.d2doFunk",
	"noteheads.u0reFunk",
	"noteheads.d0reFunk",
	"noteheads.u1reFunk",
	"noteheads.d1reFunk",
	"noteheads.u2reFunk",
	"noteheads.d2reFunk",
	"noteheads.u0miFunk",
	"noteheads.d0miFunk",
	"noteheads.u1miFunk",
	"noteheads.d1miFunk",
	"noteheads.s2miFunk",
	"noteheads.u0faFunk",
	"noteheads.d0faFunk",
	"noteheads.u1faFunk",
	"noteheads.d1faFunk",
	"noteheads.u2faFunk",
	"noteheads.d2faFunk",
	"noteheads.s0solFunk",
	"noteheads.s1solFunk",
	"noteheads.s2solFunk",
	"noteheads.s0laFunk",
	"noteheads.s1laFunk",
	"noteheads.s2laFunk",
	"noteheads.u0tiFunk",
	"noteheads.d0tiFunk",
	"noteheads.u1tiFunk",
	"noteheads.d1tiFunk",
	"noteheads.u2tiFunk",
	"noteheads.d2tiFunk",
	"noteheads.s0doWalker",
	"noteheads.u1doWalker",
	"noteheads.d1doWalker",
	"noteheads.u2doWalker",
	"noteheads.d2doWalker",
	"noteheads.s0reWalker",
	"noteheads.u1reWalker",
	"noteheads.d1reWalker",
	"noteheads.u2reWalker",
	"noteheads.d2reWalker",
	"noteheads.s0miWalker",
	"noteheads.s1miWalker",
	"noteheads.s2miWalker",
	"noteheads.s0faWalker",
	"noteheads.u1faWalker",
	"noteheads.d1faWalker",
	"noteheads.u2faWalker",
	"noteheads.d2faWalker",
	"noteheads.s0laWalker",
	"noteheads.s1laWalker",
	"noteheads.s2laWalker",
	"noteheads.s0tiWalker",
	"noteheads.u1tiWalker",
	"noteheads.d1tiWalker",
	"noteheads.u2tiWalker",
	"noteheads.d2tiWalker",
	"flags.u3",
	"flags.u4",
	"flags.u5",
	"flags.u6",
	"flags.u7",
	"flags.d3",
	"flags.d4",
	"flags.d5",
	"flags.d6",
	"flags.d7",
	"flags.ugrace",
	"flags.dgrace",
	"rests.M3neomensural",
	"rests.M2neomensural",
	"rests.M1neomensural",
	"rests.0neomensural",
	"rests.1neomensural",
	"rests.2neomensural",
	"rests.3neomensural",
	"rests.4neomensural",
	"rests.M3mensural",
	"rests.M2mensural",
	"rests.M1mensural",
	"rests.0mensural",
	"rests.1mensural",
	"rests.2mensural",
	"rests.3mensural",
	"rests.4mensural",
	"clefs.vaticana.do",
	"clefs.vaticana.do_change",
	"clefs.vaticana.fa",
	"clefs.vaticana.fa_change",
	"clefs.medicaea.do",
	"clefs.medicaea.do_change",
	"clefs.medicaea.fa",
	"clefs.medicaea.fa_change",
	"clefs.neomensural.c",
	"clefs.neomensural.c_change",
	"clefs.petrucci.c1",
	"clefs.petrucci.c1_change",
	"clefs.petrucci.c2",
	"clefs.petrucci.c2_change",
	"clefs.petrucci.c3",
	"clefs.petrucci.c3_change",
	"clefs.petrucci.c4",
	"clefs.petrucci.c4_change",
	"clefs.petrucci.c5",
	"clefs.petrucci.c5_change",
	"clefs.mensural.c",
	"clefs.mensural.c_change",
	"clefs.blackmensural.c",
	"clefs.blackmensural.c_change",
	"clefs.petrucci.f",
	"clefs.petrucci.f_change",
	"clefs.mensural.f",
	"clefs.mensural.f_change",
	"clefs.petrucci.g",
	"clefs.petrucci.g_change",
	"clefs.mensural.g",
	"clefs.mensural.g_change",
	"clefs.hufnagel.do",
	"clefs.hufnagel.do_change",
	"clefs.hufnagel.fa",
	"clefs.hufnagel.fa_change",
	"clefs.hufnagel.do.fa",
	"clefs.hufnagel.do.fa_change",
	"clefs.kievan.do",
	"clefs.kievan.do_change",
	"custodes.hufnagel.u0",
	"custodes.hufnagel.u1",
	"custodes.hufnagel.u2",
	"custodes.hufnagel.d0",
	"custodes.hufnagel.d1",
	"custodes.hufnagel.d2",
	"custodes.medicaea.u0",
	"custodes.medicaea.u1",
	"custodes.medicaea.u2",
	"custodes.medicaea.d0",
	"custodes.medicaea.d1",
	"custodes.medicaea.d2",
	"custodes.vaticana.u0",
	"custodes.vaticana.u1",
	"custodes.vaticana.u2",
	"custodes.vaticana.d0",
	"custodes.vaticana.d1",
	"custodes.vaticana.d2",
	"custodes.mensural.u0",
	"custodes.mensural.u1",
	"custodes.mensural.u2",
	"custodes.mensural.d0",
	"custodes.mensural.d1",
	"custodes.mensural.d2",
	"accidentals.medicaeaM1",
	"accidentals.vaticanaM1",
	"accidentals.vaticana0",
	"accidentals.mensural1",
	"accidentals.mensuralM1",
	"accidentals.hufnagelM1",
	"accidentals.kievan1",
	"accidentals.kievanM1",
	"flags.mensuralu03",
	"flags.mensuralu13",
	"flags.mensuralu23",
	"flags.mensurald03",
	"flags.mensurald13",
	"flags.mensurald23",
	"flags.mensuralu04",
	"flags.mensuralu14",
	"flags.mensuralu24",
	"flags.mensurald04",
	"flags.mensurald14",
	"flags.mensurald24",
	"flags.mensuralu05",
	"flags.mensuralu15",
	"flags.mensuralu25",
	"flags.mensurald05",
	"flags.mensurald15",
	"flags.mensurald25",
	"flags.mensuralu06",
	"flags.mensuralu16",
	"flags.mensuralu26",
	"flags.mensurald06",
	"flags.mensurald16",
	"flags.mensurald26",
	"timesig.mensural44",
	"timesig.mensural22",
	"timesig.mensural32",
	"timesig.mensural64",
	"timesig.mensural94",
	"timesig.mensural34",
	"timesig.mensural68",
	"timesig.mensural98",
	"timesig.mensural48",
	"timesig.mensural68alt",
	"timesig.mensural24",
	"timesig.neomensural44",
	"timesig.neomensural22",
	"timesig.neomensural32",
	"timesig.neomensural64",
	"timesig.neomensural94",
	"timesig.neomensural34",
	"timesig.neomensural68",
	"timesig.neomensural98",
	"timesig.neomensural48",
	"timesig.neomensural68alt",
	"timesig.neomensural24",
	"scripts.ictus",
	"scripts.uaccentus",
	"scripts.daccentus",
	"scripts.usemicirculus",
	"scripts.dsemicirculus",
	"scripts.circulus",
	"scripts.augmentum",
	"scripts.usignumcongruentiae",
	"scripts.dsignumcongruentiae",
	"scripts.barline.kievan",
	"dots.dotvaticana",
	"dots.dotkievan",
	"noteheads.uM3neomensural",
	"noteheads.dM3neomensural",
	"noteheads.uM2neomensural",
	"noteheads.dM2neomensural",
	"noteheads.sM1neomensural",
	"noteheads.urM3neomensural",
	"noteheads.drM3neomensural",
	"noteheads.urM2neomensural",
	"noteheads.drM2neomensural",
	"noteheads.srM1neomensural",
	"noteheads.s0neomensural",
	"noteheads.s1neomensural",
	"noteheads.s2neomensural",
	"noteheads.s0harmonic",
	"noteheads.s2harmonic",
	"noteheads.uM3mensural",
	"noteheads.dM3mensural",
	"noteheads.sM3ligmensural",
	"noteheads.uM2mensural",
	"noteheads.dM2mensural",
	"noteheads.sM2ligmensural",
	"noteheads.sM1mensural",
	"noteheads.urM3mensural",
	"noteheads.drM3mensural",
	"noteheads.srM3ligmensural",
	"noteheads.urM2mensural",
	"noteheads.drM2mensural",
	"noteheads.srM2ligmensural",
	"noteheads.srM1mensural",
	"noteheads.uM3semimensural",
	"noteheads.dM3semimensural",
	"noteheads.sM3semiligmensural",
	"noteheads.uM2semimensural",
	"noteheads.dM2semimensural",
	"noteheads.sM2semiligmensural",
	"noteheads.sM1semimensural",
	"noteheads.urM3semimensural",
	"noteheads.drM3semimensural",
	"noteheads.srM3semiligmensural",
	"noteheads.urM2semimensural",
	"noteheads.drM2semimensural",
	"noteheads.srM2semiligmensural",
	"noteheads.srM1semimensural",
	"noteheads.uM3blackmensural",
	"noteheads.dM3blackmensural",
	"noteheads.sM3blackligmensural",
	"noteheads.uM2blackmensural",
	"noteheads.dM2blackmensural",
	"noteheads.sM2blackligmensural",
	"noteheads.sM1blackmensural",
	"noteheads.s0mensural",
	"noteheads.s1mensural",
	"noteheads.s2mensural",
	"noteheads.s0blackmensural",
	"noteheads.s0petrucci",
	"noteheads.s1petrucci",
	"noteheads.s2petrucci",
	"noteheads.s0blackpetrucci",
	"noteheads.s1blackpetrucci",
	"noteheads.s2blackpetrucci",
	"noteheads.svaticana.punctum",
	"noteheads.svaticana.punctum.cavum",
	"noteheads.svaticana.linea.punctum",
	"noteheads.svaticana.linea.punctum.cavum",
	"noteheads.svaticana.inclinatum",
	"noteheads.svaticana.lpes",
	"noteheads.svaticana.vlpes",
	"noteheads.svaticana.upes",
	"noteheads.svaticana.vupes",
	"noteheads.svaticana.plica",
	"noteheads.svaticana.vplica",
	"noteheads.svaticana.epiphonus",
	"noteheads.svaticana.vepiphonus",
	"noteheads.svaticana.reverse.plica",
	"noteheads.svaticana.reverse.vplica",
	"noteheads.svaticana.inner.cephalicus",
	"noteheads.svaticana.cephalicus",
	"noteheads.svaticana.quilisma",
	"noteheads.ssolesmes.incl.parvum",
	"noteheads.ssolesmes.auct.asc",
	"noteheads.ssolesmes.auct.desc",
	"noteheads.ssolesmes.incl.auctum",
	"noteheads.ssolesmes.stropha",
	"noteheads.ssolesmes.stropha.aucta",
	"noteheads.ssolesmes.oriscus",
	"noteheads.smedicaea.inclinatum",
	"noteheads.smedicaea.punctum",
	"noteheads.smedicaea.rvirga",
	"noteheads.smedicaea.virga",
	"noteheads.shufnagel.punctum",
	"noteheads.shufnagel.virga",
	"noteheads.shufnagel.lpes",
	"noteheads.sM2kievan",
	"noteheads.sM1kievan",
	"noteheads.s0kievan",
	"noteheads.d2kievan",
	"noteheads.u2kievan",
	"noteheads.s1kievan",
	"noteheads.sr1kievan",
	"noteheads.d3kievan",
	"noteheads.u3kievan",
	"space",
	"plus",
	"comma",
	"hyphen",
	"period",
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"f",
	"m",
	"p",
	"r",
	"s",
	"z",
};


const slashGlyphName = (glyph: Glyph): string => {
	if (!glyph)
		return null;

	return (glyph as any).replace(/\./g, "-").replace("*", "star");
};


enum GlyphUnicode {
	"rests.0"	= "\uE000",
	"rests.1"	= "\uE001",
	"rests.0o"	= "\uE002",
	"rests.1o"	= "\uE003",
	"rests.M3"	= "\uE004",
	"rests.M2"	= "\uE005",
	"rests.M1"	= "\uE006",
	"rests.M1o"	= "\uE007",
	"rests.2"	= "\uE008",
	"rests.2classical"	= "\uE009",
	"rests.2z"	= "\uE00A",
	"rests.3"	= "\uE00B",
	"rests.4"	= "\uE00C",
	"rests.5"	= "\uE00D",
	"rests.6"	= "\uE00E",
	"rests.7"	= "\uE00F",
	"rests.8"	= "\uE010",
	"rests.9"	= "\uE011",
	"rests.10"	= "\uE012",
	"accidentals.sharp"	= "\uE013",
	"accidentals.sharp.arrowup"	= "\uE014",
	"accidentals.sharp.arrowdown"	= "\uE015",
	"accidentals.sharp.arrowboth"	= "\uE016",
	"accidentals.sharp.slashslash.stem"	= "\uE017",
	"accidentals.sharp.slashslashslash.stemstem"	= "\uE018",
	"accidentals.sharp.slashslashslash.stem"	= "\uE019",
	"accidentals.sharp.slash.stem"	= "\uE01A",
	"accidentals.sharp.slashslash.stemstemstem"	= "\uE01B",
	"accidentals.doublesharp"	= "\uE01C",
	"accidentals.natural"	= "\uE01D",
	"accidentals.natural.arrowup"	= "\uE01E",
	"accidentals.natural.arrowdown"	= "\uE01F",
	"accidentals.natural.arrowboth"	= "\uE020",
	"accidentals.flat"	= "\uE021",
	"accidentals.flat.arrowup"	= "\uE022",
	"accidentals.flat.arrowdown"	= "\uE023",
	"accidentals.flat.arrowboth"	= "\uE024",
	"accidentals.flat.slash"	= "\uE025",
	"accidentals.flat.slashslash"	= "\uE026",
	"accidentals.mirroredflat.flat"	= "\uE027",
	"accidentals.mirroredflat"	= "\uE028",
	"accidentals.mirroredflat.backslash"	= "\uE029",
	"accidentals.flatflat"	= "\uE02A",
	"accidentals.flatflat.slash"	= "\uE02B",
	"accidentals.rightparen"	= "\uE02C",
	"accidentals.leftparen"	= "\uE02D",
	"arrowheads.open.01"	= "\uE02E",
	"arrowheads.open.0M1"	= "\uE02F",
	"arrowheads.open.11"	= "\uE030",
	"arrowheads.open.1M1"	= "\uE031",
	"arrowheads.close.01"	= "\uE032",
	"arrowheads.close.0M1"	= "\uE033",
	"arrowheads.close.11"	= "\uE034",
	"arrowheads.close.1M1"	= "\uE035",
	"dots.dot"	= "\uE036",
	"scripts.ufermata"	= "\uE037",
	"scripts.dfermata"	= "\uE038",
	"scripts.uhenzeshortfermata"	= "\uE039",
	"scripts.dhenzeshortfermata"	= "\uE03A",
	"scripts.uhenzelongfermata"	= "\uE03B",
	"scripts.dhenzelongfermata"	= "\uE03C",
	"scripts.ushortfermata"	= "\uE03D",
	"scripts.dshortfermata"	= "\uE03E",
	"scripts.uveryshortfermata"	= "\uE03F",
	"scripts.dveryshortfermata"	= "\uE040",
	"scripts.ulongfermata"	= "\uE041",
	"scripts.dlongfermata"	= "\uE042",
	"scripts.uverylongfermata"	= "\uE043",
	"scripts.dverylongfermata"	= "\uE044",
	"scripts.thumb"	= "\uE045",
	"scripts.sforzato"	= "\uE046",
	"scripts.espr"	= "\uE047",
	"scripts.staccato"	= "\uE048",
	"scripts.ustaccatissimo"	= "\uE049",
	"scripts.dstaccatissimo"	= "\uE04A",
	"scripts.tenuto"	= "\uE04B",
	"scripts.uportato"	= "\uE04C",
	"scripts.dportato"	= "\uE04D",
	"scripts.umarcato"	= "\uE04E",
	"scripts.dmarcato"	= "\uE04F",
	"scripts.open"	= "\uE050",
	"scripts.halfopen"	= "\uE051",
	"scripts.halfopenvertical"	= "\uE052",
	"scripts.stopped"	= "\uE053",
	"scripts.upbow"	= "\uE054",
	"scripts.downbow"	= "\uE055",
	"scripts.reverseturn"	= "\uE056",
	"scripts.turn"	= "\uE057",
	"scripts.slashturn"	= "\uE058",
	"scripts.haydnturn"	= "\uE059",
	"scripts.trill"	= "\uE05A",
	"scripts.upedalheel"	= "\uE05B",
	"scripts.dpedalheel"	= "\uE05C",
	"scripts.upedaltoe"	= "\uE05D",
	"scripts.dpedaltoe"	= "\uE05E",
	"scripts.flageolet"	= "\uE05F",
	"scripts.segno"	= "\uE060",
	"scripts.varsegno"	= "\uE061",
	"scripts.coda"	= "\uE062",
	"scripts.varcoda"	= "\uE063",
	"scripts.rcomma"	= "\uE064",
	"scripts.lcomma"	= "\uE065",
	"scripts.rvarcomma"	= "\uE066",
	"scripts.lvarcomma"	= "\uE067",
	"scripts.arpeggio"	= "\uE068",
	"scripts.trill_element"	= "\uE069",
	"scripts.arpeggio.arrow.M1"	= "\uE06A",
	"scripts.arpeggio.arrow.1"	= "\uE06B",
	"scripts.trillelement"	= "\uE06C",
	"scripts.prall"	= "\uE06D",
	"scripts.mordent"	= "\uE06E",
	"scripts.prallprall"	= "\uE06F",
	"scripts.prallmordent"	= "\uE070",
	"scripts.upprall"	= "\uE071",
	"scripts.upmordent"	= "\uE072",
	"scripts.prallup"	= "\uE073",
	"scripts.downprall"	= "\uE074",
	"scripts.downmordent"	= "\uE075",
	"scripts.pralldown"	= "\uE076",
	"scripts.lineprall"	= "\uE077",
	"scripts.caesura.curved"	= "\uE078",
	"scripts.caesura.straight"	= "\uE079",
	"scripts.tickmark"	= "\uE07A",
	"scripts.snappizzicato"	= "\uE07B",
	"clefs.C"	= "\uE07C",
	"clefs.C_change"	= "\uE07D",
	"clefs.varC"	= "\uE07E",
	"clefs.varC_change"	= "\uE07F",
	"clefs.F"	= "\uE080",
	"clefs.F_change"	= "\uE081",
	"clefs.G"	= "\uE082",
	"clefs.G_change"	= "\uE083",
	"clefs.GG"	= "\uE084",
	"clefs.GG_change"	= "\uE085",
	"clefs.tenorG"	= "\uE086",
	"clefs.tenorG_change"	= "\uE087",
	"clefs.percussion"	= "\uE088",
	"clefs.percussion_change"	= "\uE089",
	"clefs.varpercussion"	= "\uE08A",
	"clefs.varpercussion_change"	= "\uE08B",
	"clefs.tab"	= "\uE08C",
	"clefs.tab_change"	= "\uE08D",
	"timesig.C44"	= "\uE08E",
	"timesig.C22"	= "\uE08F",
	"pedal.*"	= "\uE090",
	"pedal.M"	= "\uE091",
	"pedal.."	= "\uE092",
	"pedal.P"	= "\uE093",
	"pedal.d"	= "\uE094",
	"pedal.e"	= "\uE095",
	"pedal.Ped"	= "\uE096",
	"brackettips.up"	= "\uE097",
	"brackettips.down"	= "\uE098",
	"accordion.discant"	= "\uE099",
	"accordion.dot"	= "\uE09A",
	"accordion.freebass"	= "\uE09B",
	"accordion.stdbass"	= "\uE09C",
	"accordion.bayanbass"	= "\uE09D",
	"accordion.oldEE"	= "\uE09E",
	"accordion.push"	= "\uE09F",
	"accordion.pull"	= "\uE0A0",
	"ties.lyric.short"	= "\uE0A1",
	"ties.lyric.default"	= "\uE0A2",
	"noteheads.uM2"	= "\uE0A3",
	"noteheads.dM2"	= "\uE0A4",
	"noteheads.sM1"	= "\uE0A5",
	"noteheads.sM1double"	= "\uE0A6",
	"noteheads.s0"	= "\uE0A7",
	"noteheads.s1"	= "\uE0A8",
	"noteheads.s2"	= "\uE0A9",
	"noteheads.s0diamond"	= "\uE0AA",
	"noteheads.s1diamond"	= "\uE0AB",
	"noteheads.s2diamond"	= "\uE0AC",
	"noteheads.s0triangle"	= "\uE0AD",
	"noteheads.d1triangle"	= "\uE0AE",
	"noteheads.u1triangle"	= "\uE0AF",
	"noteheads.u2triangle"	= "\uE0B0",
	"noteheads.d2triangle"	= "\uE0B1",
	"noteheads.s0slash"	= "\uE0B2",
	"noteheads.s1slash"	= "\uE0B3",
	"noteheads.s2slash"	= "\uE0B4",
	"noteheads.s0cross"	= "\uE0B5",
	"noteheads.s1cross"	= "\uE0B6",
	"noteheads.s2cross"	= "\uE0B7",
	"noteheads.s2xcircle"	= "\uE0B8",
	"noteheads.s0do"	= "\uE0B9",
	"noteheads.d1do"	= "\uE0BA",
	"noteheads.u1do"	= "\uE0BB",
	"noteheads.d2do"	= "\uE0BC",
	"noteheads.u2do"	= "\uE0BD",
	"noteheads.s0doThin"	= "\uE0BE",
	"noteheads.d1doThin"	= "\uE0BF",
	"noteheads.u1doThin"	= "\uE0C0",
	"noteheads.d2doThin"	= "\uE0C1",
	"noteheads.u2doThin"	= "\uE0C2",
	"noteheads.s0re"	= "\uE0C3",
	"noteheads.u1re"	= "\uE0C4",
	"noteheads.d1re"	= "\uE0C5",
	"noteheads.u2re"	= "\uE0C6",
	"noteheads.d2re"	= "\uE0C7",
	"noteheads.s0reThin"	= "\uE0C8",
	"noteheads.u1reThin"	= "\uE0C9",
	"noteheads.d1reThin"	= "\uE0CA",
	"noteheads.u2reThin"	= "\uE0CB",
	"noteheads.d2reThin"	= "\uE0CC",
	"noteheads.s0mi"	= "\uE0CD",
	"noteheads.s1mi"	= "\uE0CE",
	"noteheads.s2mi"	= "\uE0CF",
	"noteheads.s0miMirror"	= "\uE0D0",
	"noteheads.s1miMirror"	= "\uE0D1",
	"noteheads.s2miMirror"	= "\uE0D2",
	"noteheads.s0miThin"	= "\uE0D3",
	"noteheads.s1miThin"	= "\uE0D4",
	"noteheads.s2miThin"	= "\uE0D5",
	"noteheads.u0fa"	= "\uE0D6",
	"noteheads.d0fa"	= "\uE0D7",
	"noteheads.u1fa"	= "\uE0D8",
	"noteheads.d1fa"	= "\uE0D9",
	"noteheads.u2fa"	= "\uE0DA",
	"noteheads.d2fa"	= "\uE0DB",
	"noteheads.u0faThin"	= "\uE0DC",
	"noteheads.d0faThin"	= "\uE0DD",
	"noteheads.u1faThin"	= "\uE0DE",
	"noteheads.d1faThin"	= "\uE0DF",
	"noteheads.u2faThin"	= "\uE0E0",
	"noteheads.d2faThin"	= "\uE0E1",
	"noteheads.s0sol"	= "\uE0E2",
	"noteheads.s1sol"	= "\uE0E3",
	"noteheads.s2sol"	= "\uE0E4",
	"noteheads.s0la"	= "\uE0E5",
	"noteheads.s1la"	= "\uE0E6",
	"noteheads.s2la"	= "\uE0E7",
	"noteheads.s0laThin"	= "\uE0E8",
	"noteheads.s1laThin"	= "\uE0E9",
	"noteheads.s2laThin"	= "\uE0EA",
	"noteheads.s0ti"	= "\uE0EB",
	"noteheads.u1ti"	= "\uE0EC",
	"noteheads.d1ti"	= "\uE0ED",
	"noteheads.u2ti"	= "\uE0EE",
	"noteheads.d2ti"	= "\uE0EF",
	"noteheads.s0tiThin"	= "\uE0F0",
	"noteheads.u1tiThin"	= "\uE0F1",
	"noteheads.d1tiThin"	= "\uE0F2",
	"noteheads.u2tiThin"	= "\uE0F3",
	"noteheads.d2tiThin"	= "\uE0F4",
	"noteheads.u0doFunk"	= "\uE0F5",
	"noteheads.d0doFunk"	= "\uE0F6",
	"noteheads.u1doFunk"	= "\uE0F7",
	"noteheads.d1doFunk"	= "\uE0F8",
	"noteheads.u2doFunk"	= "\uE0F9",
	"noteheads.d2doFunk"	= "\uE0FA",
	"noteheads.u0reFunk"	= "\uE0FB",
	"noteheads.d0reFunk"	= "\uE0FC",
	"noteheads.u1reFunk"	= "\uE0FD",
	"noteheads.d1reFunk"	= "\uE0FE",
	"noteheads.u2reFunk"	= "\uE0FF",
	"noteheads.d2reFunk"	= "\uE100",
	"noteheads.u0miFunk"	= "\uE101",
	"noteheads.d0miFunk"	= "\uE102",
	"noteheads.u1miFunk"	= "\uE103",
	"noteheads.d1miFunk"	= "\uE104",
	"noteheads.s2miFunk"	= "\uE105",
	"noteheads.u0faFunk"	= "\uE106",
	"noteheads.d0faFunk"	= "\uE107",
	"noteheads.u1faFunk"	= "\uE108",
	"noteheads.d1faFunk"	= "\uE109",
	"noteheads.u2faFunk"	= "\uE10A",
	"noteheads.d2faFunk"	= "\uE10B",
	"noteheads.s0solFunk"	= "\uE10C",
	"noteheads.s1solFunk"	= "\uE10D",
	"noteheads.s2solFunk"	= "\uE10E",
	"noteheads.s0laFunk"	= "\uE10F",
	"noteheads.s1laFunk"	= "\uE110",
	"noteheads.s2laFunk"	= "\uE111",
	"noteheads.u0tiFunk"	= "\uE112",
	"noteheads.d0tiFunk"	= "\uE113",
	"noteheads.u1tiFunk"	= "\uE114",
	"noteheads.d1tiFunk"	= "\uE115",
	"noteheads.u2tiFunk"	= "\uE116",
	"noteheads.d2tiFunk"	= "\uE117",
	"noteheads.s0doWalker"	= "\uE118",
	"noteheads.u1doWalker"	= "\uE119",
	"noteheads.d1doWalker"	= "\uE11A",
	"noteheads.u2doWalker"	= "\uE11B",
	"noteheads.d2doWalker"	= "\uE11C",
	"noteheads.s0reWalker"	= "\uE11D",
	"noteheads.u1reWalker"	= "\uE11E",
	"noteheads.d1reWalker"	= "\uE11F",
	"noteheads.u2reWalker"	= "\uE120",
	"noteheads.d2reWalker"	= "\uE121",
	"noteheads.s0miWalker"	= "\uE122",
	"noteheads.s1miWalker"	= "\uE123",
	"noteheads.s2miWalker"	= "\uE124",
	"noteheads.s0faWalker"	= "\uE125",
	"noteheads.u1faWalker"	= "\uE126",
	"noteheads.d1faWalker"	= "\uE127",
	"noteheads.u2faWalker"	= "\uE128",
	"noteheads.d2faWalker"	= "\uE129",
	"noteheads.s0laWalker"	= "\uE12A",
	"noteheads.s1laWalker"	= "\uE12B",
	"noteheads.s2laWalker"	= "\uE12C",
	"noteheads.s0tiWalker"	= "\uE12D",
	"noteheads.u1tiWalker"	= "\uE12E",
	"noteheads.d1tiWalker"	= "\uE12F",
	"noteheads.u2tiWalker"	= "\uE130",
	"noteheads.d2tiWalker"	= "\uE131",
	"flags.u3"	= "\uE132",
	"flags.u4"	= "\uE133",
	"flags.u5"	= "\uE134",
	"flags.u6"	= "\uE135",
	"flags.u7"	= "\uE136",
	"flags.u8"	= "\uE137",
	"flags.u9"	= "\uE138",
	"flags.u10"	= "\uE139",
	"flags.d3"	= "\uE13A",
	"flags.d4"	= "\uE13B",
	"flags.d5"	= "\uE13C",
	"flags.d6"	= "\uE13D",
	"flags.d7"	= "\uE13E",
	"flags.d8"	= "\uE13F",
	"flags.d9"	= "\uE140",
	"flags.d10"	= "\uE141",
	"flags.ugrace"	= "\uE142",
	"flags.dgrace"	= "\uE143",
	"rests.M3neomensural"	= "\uE144",
	"rests.M2neomensural"	= "\uE145",
	"rests.M1neomensural"	= "\uE146",
	"rests.0neomensural"	= "\uE147",
	"rests.1neomensural"	= "\uE148",
	"rests.2neomensural"	= "\uE149",
	"rests.3neomensural"	= "\uE14A",
	"rests.4neomensural"	= "\uE14B",
	"rests.M3mensural"	= "\uE14C",
	"rests.M2mensural"	= "\uE14D",
	"rests.M1mensural"	= "\uE14E",
	"rests.0mensural"	= "\uE14F",
	"rests.1mensural"	= "\uE150",
	"rests.2mensural"	= "\uE151",
	"rests.3mensural"	= "\uE152",
	"rests.4mensural"	= "\uE153",
	"clefs.vaticana.do"	= "\uE154",
	"clefs.vaticana.do_change"	= "\uE155",
	"clefs.vaticana.fa"	= "\uE156",
	"clefs.vaticana.fa_change"	= "\uE157",
	"clefs.medicaea.do"	= "\uE158",
	"clefs.medicaea.do_change"	= "\uE159",
	"clefs.medicaea.fa"	= "\uE15A",
	"clefs.medicaea.fa_change"	= "\uE15B",
	"clefs.neomensural.c"	= "\uE15C",
	"clefs.neomensural.c_change"	= "\uE15D",
	"clefs.petrucci.c1"	= "\uE15E",
	"clefs.petrucci.c1_change"	= "\uE15F",
	"clefs.petrucci.c2"	= "\uE160",
	"clefs.petrucci.c2_change"	= "\uE161",
	"clefs.petrucci.c3"	= "\uE162",
	"clefs.petrucci.c3_change"	= "\uE163",
	"clefs.petrucci.c4"	= "\uE164",
	"clefs.petrucci.c4_change"	= "\uE165",
	"clefs.petrucci.c5"	= "\uE166",
	"clefs.petrucci.c5_change"	= "\uE167",
	"clefs.mensural.c"	= "\uE168",
	"clefs.mensural.c_change"	= "\uE169",
	"clefs.blackmensural.c"	= "\uE16A",
	"clefs.blackmensural.c_change"	= "\uE16B",
	"clefs.petrucci.f"	= "\uE16C",
	"clefs.petrucci.f_change"	= "\uE16D",
	"clefs.mensural.f"	= "\uE16E",
	"clefs.mensural.f_change"	= "\uE16F",
	"clefs.petrucci.g"	= "\uE170",
	"clefs.petrucci.g_change"	= "\uE171",
	"clefs.mensural.g"	= "\uE172",
	"clefs.mensural.g_change"	= "\uE173",
	"clefs.hufnagel.do"	= "\uE174",
	"clefs.hufnagel.do_change"	= "\uE175",
	"clefs.hufnagel.fa"	= "\uE176",
	"clefs.hufnagel.fa_change"	= "\uE177",
	"clefs.hufnagel.do.fa"	= "\uE178",
	"clefs.hufnagel.do.fa_change"	= "\uE179",
	"clefs.kievan.do"	= "\uE17A",
	"clefs.kievan.do_change"	= "\uE17B",
	"custodes.hufnagel.u0"	= "\uE17C",
	"custodes.hufnagel.u1"	= "\uE17D",
	"custodes.hufnagel.u2"	= "\uE17E",
	"custodes.hufnagel.d0"	= "\uE17F",
	"custodes.hufnagel.d1"	= "\uE180",
	"custodes.hufnagel.d2"	= "\uE181",
	"custodes.medicaea.u0"	= "\uE182",
	"custodes.medicaea.u1"	= "\uE183",
	"custodes.medicaea.u2"	= "\uE184",
	"custodes.medicaea.d0"	= "\uE185",
	"custodes.medicaea.d1"	= "\uE186",
	"custodes.medicaea.d2"	= "\uE187",
	"custodes.vaticana.u0"	= "\uE188",
	"custodes.vaticana.u1"	= "\uE189",
	"custodes.vaticana.u2"	= "\uE18A",
	"custodes.vaticana.d0"	= "\uE18B",
	"custodes.vaticana.d1"	= "\uE18C",
	"custodes.vaticana.d2"	= "\uE18D",
	"custodes.mensural.u0"	= "\uE18E",
	"custodes.mensural.u1"	= "\uE18F",
	"custodes.mensural.u2"	= "\uE190",
	"custodes.mensural.d0"	= "\uE191",
	"custodes.mensural.d1"	= "\uE192",
	"custodes.mensural.d2"	= "\uE193",
	"accidentals.medicaeaM1"	= "\uE194",
	"accidentals.vaticanaM1"	= "\uE195",
	"accidentals.vaticana0"	= "\uE196",
	"accidentals.mensural1"	= "\uE197",
	"accidentals.mensuralM1"	= "\uE198",
	"accidentals.hufnagelM1"	= "\uE199",
	"accidentals.kievan1"	= "\uE19A",
	"accidentals.kievanM1"	= "\uE19B",
	"flags.mensuralu03"	= "\uE19C",
	"flags.mensuralu13"	= "\uE19D",
	"flags.mensuralu23"	= "\uE19E",
	"flags.mensurald03"	= "\uE19F",
	"flags.mensurald13"	= "\uE1A0",
	"flags.mensurald23"	= "\uE1A1",
	"flags.mensuralu04"	= "\uE1A2",
	"flags.mensuralu14"	= "\uE1A3",
	"flags.mensuralu24"	= "\uE1A4",
	"flags.mensurald04"	= "\uE1A5",
	"flags.mensurald14"	= "\uE1A6",
	"flags.mensurald24"	= "\uE1A7",
	"flags.mensuralu05"	= "\uE1A8",
	"flags.mensuralu15"	= "\uE1A9",
	"flags.mensuralu25"	= "\uE1AA",
	"flags.mensurald05"	= "\uE1AB",
	"flags.mensurald15"	= "\uE1AC",
	"flags.mensurald25"	= "\uE1AD",
	"flags.mensuralu06"	= "\uE1AE",
	"flags.mensuralu16"	= "\uE1AF",
	"flags.mensuralu26"	= "\uE1B0",
	"flags.mensurald06"	= "\uE1B1",
	"flags.mensurald16"	= "\uE1B2",
	"flags.mensurald26"	= "\uE1B3",
	"timesig.mensural44"	= "\uE1B4",
	"timesig.mensural22"	= "\uE1B5",
	"timesig.mensural32"	= "\uE1B6",
	"timesig.mensural64"	= "\uE1B7",
	"timesig.mensural94"	= "\uE1B8",
	"timesig.mensural34"	= "\uE1B9",
	"timesig.mensural68"	= "\uE1BA",
	"timesig.mensural98"	= "\uE1BB",
	"timesig.mensural48"	= "\uE1BC",
	"timesig.mensural68alt"	= "\uE1BD",
	"timesig.mensural24"	= "\uE1BE",
	"timesig.neomensural44"	= "\uE1BF",
	"timesig.neomensural22"	= "\uE1C0",
	"timesig.neomensural32"	= "\uE1C1",
	"timesig.neomensural64"	= "\uE1C2",
	"timesig.neomensural94"	= "\uE1C3",
	"timesig.neomensural34"	= "\uE1C4",
	"timesig.neomensural68"	= "\uE1C5",
	"timesig.neomensural98"	= "\uE1C6",
	"timesig.neomensural48"	= "\uE1C7",
	"timesig.neomensural68alt"	= "\uE1C8",
	"timesig.neomensural24"	= "\uE1C9",
	"scripts.ictus"	= "\uE1CA",
	"scripts.uaccentus"	= "\uE1CB",
	"scripts.daccentus"	= "\uE1CC",
	"scripts.usemicirculus"	= "\uE1CD",
	"scripts.dsemicirculus"	= "\uE1CE",
	"scripts.circulus"	= "\uE1CF",
	"scripts.augmentum"	= "\uE1D0",
	"scripts.usignumcongruentiae"	= "\uE1D1",
	"scripts.dsignumcongruentiae"	= "\uE1D2",
	"scripts.barline.kievan"	= "\uE1D3",
	"dots.dotvaticana"	= "\uE1D4",
	"dots.dotkievan"	= "\uE1D5",
	"noteheads.uM3neomensural"	= "\uE1D6",
	"noteheads.dM3neomensural"	= "\uE1D7",
	"noteheads.uM2neomensural"	= "\uE1D8",
	"noteheads.dM2neomensural"	= "\uE1D9",
	"noteheads.sM1neomensural"	= "\uE1DA",
	"noteheads.urM3neomensural"	= "\uE1DB",
	"noteheads.drM3neomensural"	= "\uE1DC",
	"noteheads.urM2neomensural"	= "\uE1DD",
	"noteheads.drM2neomensural"	= "\uE1DE",
	"noteheads.srM1neomensural"	= "\uE1DF",
	"noteheads.s0neomensural"	= "\uE1E0",
	"noteheads.s1neomensural"	= "\uE1E1",
	"noteheads.s2neomensural"	= "\uE1E2",
	"noteheads.s0harmonic"	= "\uE1E3",
	"noteheads.s2harmonic"	= "\uE1E4",
	"noteheads.uM3mensural"	= "\uE1E5",
	"noteheads.dM3mensural"	= "\uE1E6",
	"noteheads.sM3ligmensural"	= "\uE1E7",
	"noteheads.uM2mensural"	= "\uE1E8",
	"noteheads.dM2mensural"	= "\uE1E9",
	"noteheads.sM2ligmensural"	= "\uE1EA",
	"noteheads.sM1mensural"	= "\uE1EB",
	"noteheads.urM3mensural"	= "\uE1EC",
	"noteheads.drM3mensural"	= "\uE1ED",
	"noteheads.srM3ligmensural"	= "\uE1EE",
	"noteheads.urM2mensural"	= "\uE1EF",
	"noteheads.drM2mensural"	= "\uE1F0",
	"noteheads.srM2ligmensural"	= "\uE1F1",
	"noteheads.srM1mensural"	= "\uE1F2",
	"noteheads.uM3semimensural"	= "\uE1F3",
	"noteheads.dM3semimensural"	= "\uE1F4",
	"noteheads.sM3semiligmensural"	= "\uE1F5",
	"noteheads.uM2semimensural"	= "\uE1F6",
	"noteheads.dM2semimensural"	= "\uE1F7",
	"noteheads.sM2semiligmensural"	= "\uE1F8",
	"noteheads.sM1semimensural"	= "\uE1F9",
	"noteheads.urM3semimensural"	= "\uE1FA",
	"noteheads.drM3semimensural"	= "\uE1FB",
	"noteheads.srM3semiligmensural"	= "\uE1FC",
	"noteheads.urM2semimensural"	= "\uE1FD",
	"noteheads.drM2semimensural"	= "\uE1FE",
	"noteheads.srM2semiligmensural"	= "\uE1FF",
	"noteheads.srM1semimensural"	= "\uE200",
	"noteheads.uM3blackmensural"	= "\uE201",
	"noteheads.dM3blackmensural"	= "\uE202",
	"noteheads.sM3blackligmensural"	= "\uE203",
	"noteheads.uM2blackmensural"	= "\uE204",
	"noteheads.dM2blackmensural"	= "\uE205",
	"noteheads.sM2blackligmensural"	= "\uE206",
	"noteheads.sM1blackmensural"	= "\uE207",
	"noteheads.s0mensural"	= "\uE208",
	"noteheads.s1mensural"	= "\uE209",
	"noteheads.s2mensural"	= "\uE20A",
	"noteheads.s0blackmensural"	= "\uE20B",
	"noteheads.s0petrucci"	= "\uE20C",
	"noteheads.s1petrucci"	= "\uE20D",
	"noteheads.s2petrucci"	= "\uE20E",
	"noteheads.s0blackpetrucci"	= "\uE20F",
	"noteheads.s1blackpetrucci"	= "\uE210",
	"noteheads.s2blackpetrucci"	= "\uE211",
	"noteheads.svaticana.punctum"	= "\uE212",
	"noteheads.svaticana.punctum.cavum"	= "\uE213",
	"noteheads.svaticana.linea.punctum"	= "\uE214",
	"noteheads.svaticana.linea.punctum.cavum"	= "\uE215",
	"noteheads.svaticana.inclinatum"	= "\uE216",
	"noteheads.svaticana.lpes"	= "\uE217",
	"noteheads.svaticana.vlpes"	= "\uE218",
	"noteheads.svaticana.upes"	= "\uE219",
	"noteheads.svaticana.vupes"	= "\uE21A",
	"noteheads.svaticana.plica"	= "\uE21B",
	"noteheads.svaticana.vplica"	= "\uE21C",
	"noteheads.svaticana.epiphonus"	= "\uE21D",
	"noteheads.svaticana.vepiphonus"	= "\uE21E",
	"noteheads.svaticana.reverse.plica"	= "\uE21F",
	"noteheads.svaticana.reverse.vplica"	= "\uE220",
	"noteheads.svaticana.inner.cephalicus"	= "\uE221",
	"noteheads.svaticana.cephalicus"	= "\uE222",
	"noteheads.svaticana.quilisma"	= "\uE223",
	"noteheads.ssolesmes.incl.parvum"	= "\uE224",
	"noteheads.ssolesmes.auct.asc"	= "\uE225",
	"noteheads.ssolesmes.auct.desc"	= "\uE226",
	"noteheads.ssolesmes.incl.auctum"	= "\uE227",
	"noteheads.ssolesmes.stropha"	= "\uE228",
	"noteheads.ssolesmes.stropha.aucta"	= "\uE229",
	"noteheads.ssolesmes.oriscus"	= "\uE22A",
	"noteheads.smedicaea.inclinatum"	= "\uE22B",
	"noteheads.smedicaea.punctum"	= "\uE22C",
	"noteheads.smedicaea.rvirga"	= "\uE22D",
	"noteheads.smedicaea.virga"	= "\uE22E",
	"noteheads.shufnagel.punctum"	= "\uE22F",
	"noteheads.shufnagel.virga"	= "\uE230",
	"noteheads.shufnagel.lpes"	= "\uE231",
	"noteheads.sM2kievan"	= "\uE232",
	"noteheads.sM1kievan"	= "\uE233",
	"noteheads.s0kievan"	= "\uE234",
	"noteheads.d2kievan"	= "\uE235",
	"noteheads.u2kievan"	= "\uE236",
	"noteheads.s1kievan"	= "\uE237",
	"noteheads.sr1kievan"	= "\uE238",
	"noteheads.d3kievan"	= "\uE239",
	"noteheads.u3kievan"	= "\uE23A",
	"space"	= " ",
	"plus"	= "+",
	"comma"	= ",",
	"hyphen"	= "-",
	"period"	= ".",
	"zero"	= "0",
	"one"	= "1",
	"two"	= "2",
	"three"	= "3",
	"four"	= "4",
	"five"	= "5",
	"six"	= "6",
	"seven"	= "7",
	"eight"	= "8",
	"nine"	= "9",
	"f"	= "f",
	"m"	= "m",
	"n"	= "n",
	"p"	= "p",
	"r"	= "r",
	"s"	= "s",
	"z"	= "z",
};



export {
	Glyph,
	GlyphUnicode,
	glyphHash,
	slashGlyphName,
};
