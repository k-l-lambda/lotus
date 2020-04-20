\version "2.20.0"
% automatically converted by musicxml2ly from ./temp/xml2ly-yMjI5OTU5MT.xml

\header {
    subtitle =  \markup \column {
        \line { "with Appoggiaturas and other useful Embelishments."}
        \line { "                                  Op.599  No.100"} }
    
    copyright =  "©"
    encodingdate =  "2017-04-14"
    title =  Exercises
    poet =  "3"
    composer =  "C.Czerny"
    encodingsoftware =  "Finale 2014 for Mac"
    }

#(set-global-staff-size 22.7288571429)
\paper {
    
    paper-width = 21.0\cm
    paper-height = 29.71\cm
    top-margin = 0.99\cm
    bottom-margin = 1.67\cm
    left-margin = 0.99\cm
    right-margin = 0.89\cm
    between-system-space = 3.54\cm
    page-top-space = 2.68\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative des' {
    \repeat volta 2 {
        \clef "treble" \key bes \minor \time 3/4 | % 1
        \times 2/3  {
            \stemUp des8 ( _2 [ _\p ^\markup{ \bold {Allegro} } \stemUp
            f8 _1 \stemUp as8 _2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^4 [ \stemDown f8 ^1 \stemDown as8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^4 [ \stemDown as8 ^2 \stemDown f8 ^1 ] }
        | % 2
        \stemDown f'2 ^5 \stemDown des4 ) ^4 | % 3
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp des,,8 ( [ \stemUp f8 \stemUp as8 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 [ \stemDown f8 \stemDown as8 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 [ \stemDown as8 \stemDown f8 ] }
        | % 4
        \stemDown f'2 ^5 \stemDown des4 ) | % 5
        \ottava #1 | % 5
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown ges8 ( ^2 [ \stemDown as8 \stemDown bes8 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown as8 ^3 [ \stemDown ges8 \stemDown f8 ^1 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown es8 ^3 [ \stemDown des8 \stemDown c8 ] }
        \ottava #0 | % 6
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown bes8 ^4 [ \stemDown as8 \stemDown ges8 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown f8 ^1 [ \stemDown es8 ^3 \stemDown des8 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown c8 [ \stemDown as'8 \stemDown c,8 ] }
        | % 7
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^2 [ \stemDown f8 ^1 \stemDown as8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^4 [ \stemDown as8 ^2 \stemDown f8 ^1 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp des8 ^4 [ \stemUp as8 _2 \stemUp f8 _1 ] }
        | % 8
        \stemUp des4 ) r4 r4 }
    \repeat volta 2 {
        | % 9
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp as8 ( ^2 [ \stemUp c8 ^1 \stemUp es8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown as8 ^4 [ \stemDown c8 ^1 \stemDown es8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown as8 [ \stemDown es8 ^2 \stemDown c8 ^1 ] }
        | \barNumberCheck #10
        \stemUp as4 ) ^2 \stemDown <as c es ges>4 ^5 ^3 ^2 ^1 \stemDown
        <as c es ges>4 | % 11
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp des,8 ( _2 [ \stemUp f8 _1 \stemUp as8 _2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^4 [ \stemDown f8 ^1 \stemDown as8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^4 [ \stemDown as8 ^2 \stemDown f8 ^1 ] }
        | % 12
        \stemDown des4 ) ^2 \stemDown <des f as>4 ^1 ^2 ^4 \stemDown
        <des f as>4 | % 13
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown bes'8 ( ^5 [ _\p \stemDown des,8 ^1 \stemDown ges8
            ^2 ] }
        \ottava #1 \once \omit TupletNumber
        \times 2/3  {
            \stemDown bes8 ^4 [ \stemDown des8 ^1 \stemDown ges8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown bes8 ^4 [ \stemDown ges8 ^2 \stemDown des8 ^1 ] }
        | % 14
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des'8 ^5 [ _\markup{ \bold\italic {cresc.} }
            \stemDown bes8 ^4 \stemDown ges8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp des8 ^1 [ \stemUp bes8 ^4 \stemUp ges8 ^2 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp des8 ^1 [ \stemUp ges8 ^2 \stemUp bes8 ^4 ] }
        | % 15
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown as8 ^2 [ _\f \stemDown bes8 \stemDown c8 ^1 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^2 [ \stemDown es8 \stemDown f8 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown ges8 ^5 [ \stemDown es8 ^3 \stemDown c8 ^1 ] }
        \ottava #0 | % 16
        \once \omit TupletNumber
        \times 2/3  {
            \stemDown des8 ^4 [ _\ff \stemDown as8 ^2 \stemDown f8 ^1 ]
            }
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp des8 _4 [ \stemUp as8 _2 \stemUp f8 _1 ] }
        \stemUp des8 ) _2 r8 }
    }

PartPOneVoiceThree =  \relative des {
    \repeat volta 2 {
        \clef "bass" \key bes \minor \time 3/4 \stemDown des2. \stemDown
        des2. \stemDown des2. \stemDown des2. \stemDown as2.
        \stemDown as2. \stemDown des2. \stemDown des2. }
    \repeat volta 2 {
        s4 \clef "treble" s4*5 | % 11
        \clef "bass" s4 \clef "treble" s4*5 | % 13
        \clef "bass" \stemDown ges2. \stemDown ges2.         \stemDown as2 \stemDown as4 s2. }
    }

PartPOneVoiceTwo =  \relative des {
    \repeat volta 2 {
        \clef "bass" \key bes \minor \time 3/4 \stemUp des4 _4 \stemUp
        <f as>4 \stemUp <f as>4 \stemUp des4 \stemUp <f as>4 \stemUp <f
            as>4 \stemUp des4 \stemUp <f as>4 \stemUp <f as>4
        \stemUp des4 \stemUp <f as>4 \stemUp <f as>4 \stemUp as,4
        \stemUp <c es ges>4 \stemUp <c es ges>4 \stemUp as4 \stemUp <c
            es ges>4 \stemUp <c es ges>4 \stemUp des4 ^4
        \stemUp <f as>4 \stemUp <f as>4 \stemUp des4 \stemUp <f as>4
        \stemUp <f as>4 }
    \repeat volta 2 {
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp as,8 _3 [ \stemUp c8 _1 \stemUp es8 _4 ] }
        \clef "treble" \once \omit TupletNumber
        \times 2/3  {
            \stemUp as8 _2 [ \stemUp c8 _1 \stemUp es8 _4 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp as8 _2 [ \stemUp es8 _4 \stemUp c8 _1 ] }
        \stemUp as2. _3 _1 | % 11
        \clef "bass" \once \omit TupletNumber
        \times 2/3  {
            \stemDown des,8 ( _3 [ \stemDown f8 _1 \stemDown as8 _4 ] }
        \clef "treble" \once \omit TupletNumber
        \times 2/3  {
            \stemUp des8 _2 [ \stemUp f8 _1 \stemUp as8 _4 ] }
        \once \omit TupletNumber
        \times 2/3  {
            \stemUp des8 _2 [ \stemUp as8 _4 \stemUp f8 _1 ] }
        \stemUp des2. ) _3 _1 | % 13
        \clef "bass" \stemUp ges,4 \stemUp <bes des>4 _1 _2 \stemUp <bes
            des>4 \stemUp ges4 \stemUp <bes des>4 \stemUp <bes des>4
        \stemUp as4 _5 \stemUp <des f>4 _1 _2 \stemUp <es
            ges>4 _1 _2 _5 \stemDown <des f>8 _1 _3 r8 \stemUp <des,,
            des'>8 r8 r4 }
    }


% The score definition
\score {
    <<
        
        \new PianoStaff
        <<
            
            \context Staff = "1" << 
                \mergeDifferentlyDottedOn\mergeDifferentlyHeadedOn
                \context Voice = "PartPOneVoiceOne" {  \PartPOneVoiceOne }
                >> \context Staff = "2" <<
                \mergeDifferentlyDottedOn\mergeDifferentlyHeadedOn
                \context Voice = "PartPOneVoiceThree" {  \voiceOne \PartPOneVoiceThree }
                \context Voice = "PartPOneVoiceTwo" {  \voiceTwo \PartPOneVoiceTwo }
                >>
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    \midi {\tempo 4 = 120 }
    }
