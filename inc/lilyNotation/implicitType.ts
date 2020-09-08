
// implicit note (from expressive marks) types
enum ImplicitType {
	None = 0,

	Mordent = "mordent",
	Prall = "prall",
	Turn = "turn",
	// arpeggio should be an implicit type, but not implemented yet in 'articulate.ly'
	//Arpeggio = "arpeggio",
	Trill = "trill",
	Tremolo = "tremolo",
};



export default ImplicitType;
