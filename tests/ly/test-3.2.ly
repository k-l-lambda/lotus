\version "2.20.0"
% automatically converted by musicxml2ly from ./temp/xml2ly-3NDI0MDE4Nz.xml

\header {
    subtitle =  "Op.599  No.51"
    copyright =  "©"
    encodingdate =  "2017-04-12"
    title =  \markup \column {
        \line { "            Exercises"}
        \line { "with Rests and other Signs"} }
    
    poet =  "2"
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
    between-system-space = 3.46\cm
    page-top-space = 2.61\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative d'' {
    \repeat volta 2 {
        \clef "treble" \key b \minor \numericTimeSignature\time 4/4 | % 1
        \stemDown d8. ( ^3 [ ^\markup{ \bold {Alla marcia} } _\p
        \stemDown a16 ^1 \stemDown d8. \stemDown a16 ] \stemDown d8. [
        \stemDown a16 \stemDown d8. \stemDown fis16 ^5 ] | % 2
        \stemDown e8. ^4 [ \stemDown cis16 \stemDown a8. \stemDown cis16
        ] \stemDown e8 ) r8 \stemDown a,16 ( [ \stemDown b16 \stemDown
        cis16 \stemDown d16 ] | % 3
        \stemDown e8. ^5 [ _\mf \stemDown a,16 ^1 \stemDown e'8. ^3
        \stemDown a,16 ^1 ] \stemDown e'8. [ \stemDown a,16 \stemDown e'8.
        \stemDown g16 ^5 ] | % 4
        \stemDown fis8. ^4 [ \stemDown d16 \stemDown a8. \stemDown d16 ]
        \stemDown fis8 ) r8 \stemDown d'16 ( ^5 [ _\f \stemDown cis16 ^4
        \stemDown d16 \stemDown cis16 ) ] | % 5
        \stemDown <g b>2 ( ^1 ^3 _\< \stemDown <fis a>8 ) ^2 ^4 -\! r8
        \stemDown d'16 ( ^5 [ \stemDown cis16 ^4 \stemDown d16 \stemDown
        cis16 ) ] | % 6
        \stemDown <g b>2 ( _\< \stemDown <fis a>8 ) -\! r8 \stemDown b16
        ( ^5 [ _\p \stemDown a16 \stemDown b16 \stemDown a16 ] | % 7
        \stemDown g8. ) ( ^3 [ \stemDown e16 \stemDown b'8. \stemDown a16
        ] \stemDown fis8. ^2 [ \stemDown d16 \stemDown b'8. \stemDown a16
        ] | % 8
        \stemDown e8 ) ^1 r8 \stemUp e,16 ( ^5 [ \stemUp cis16 \stemUp e16
        \stemUp cis16 ] \stemUp a8 ) r8 r4 }
    \repeat volta 2 {
        | % 9
        \stemUp a'8 ^3 [ _\ff c16 \rest \stemUp a16 ( \stemUp bes8 ) _.
        ^4 c16 \rest \stemUp bes16 ( ] \stemUp a8 ) _. ^3 [ b16 \rest
        \stemUp a16 ( \stemUp gis8 ) _. ^2 b16 \rest \stemUp gis16 ( ]
        | \barNumberCheck #10
        \stemUp a8 ) _. ^3 [ r16 \stemUp a16 ( ^3 ] \stemUp e8 ) _. ^1 [
        g16 \rest \stemUp e16 ( ^4 ] \stemUp cis8 ) _. ^2 [ e16 \rest
        \stemUp cis16 ( ^2 ] \stemUp a8 ) _. ^1 [ d16 \rest \stemUp a16
        ( ] | % 11
        \stemUp d8 ) _. ^3 [ f16 \rest \stemUp d16 ( \stemUp a8 ) _. ^1
        f'16 \rest \stemUp a,16 ( ] \stemUp d8 ) _. ^3 [ g16 \rest
        \stemUp d16 ( ^2 \stemUp f8 ) _. ^4 g16 \rest \stemUp f16 ( ] | % 12
        \stemUp e8 ) _. ^3 [ g16 \rest \stemUp e16 ( ^4 ] \stemUp cis8 )
        _. ^2 [ e16 \rest \stemUp cis16 ( ^3 ] \stemUp a8 ) _. ^1 r8
        \stemDown a''16 ( ^5 [ _\p \stemDown g16 \stemDown fis16
        \stemDown e16 ] | % 13
        \stemDown d8. ) ( ^1 [ _\markup{ \bold\italic {cresc.} }
        \stemDown e16 \stemDown fis8. \stemDown g16 ] _\markup{
            \bold\italic {- - - - - - - - - - - -} } \stemDown a8 ) ^5 r8
        \stemDown b16 ( ^5 [ \stemDown a16 \stemDown g16 \stemDown fis16
        ] | % 14
        \stemDown e8. ) ( [ \stemDown fis16 \stemDown g8. \stemDown a16
        ] \stemDown b8 ) ^5 r8 \stemDown e16 ( ^5 [ \stemDown d16 _\f
        \stemDown cis16 \stemDown b16 ] | % 15
        \stemDown a8 ) r8 \stemDown b16 ( ^5 [ \stemDown a16 \stemDown g16
        \stemDown fis16 ] \stemDown e8 ) r8 \stemDown a16 ( ^5 [
        \stemDown g16 \stemDown fis16 \stemDown e16 ] | % 16
        \stemDown d8 ) r8 \stemUp a16 ( ^5 [ \stemUp fis16 \stemUp a16
        \stemUp fis16 ] \stemUp d8 ) r8 r4 }
    }

PartPOneVoiceTwo =  \relative d' {
    \repeat volta 2 {
        \clef "bass" \key b \minor \numericTimeSignature\time 4/4
        \stemDown <d fis>4 _2 _4 \stemDown <d fis>4 \stemDown <d fis>4
        \stemDown <d fis>4 \stemDown <a cis e>4 _5 \stemDown <a cis e>4
        \stemDown <a cis e>8 r8 r4 \stemDown <a cis e>4 \stemDown <a cis
            e>4 \stemDown <a cis e>4 \stemDown <a cis e>4         \stemDown <d fis>4 _2 _4 \stemDown <d fis>4 \stemDown <d fis>8 r8
        r4 \stemDown g,8. ( ^5 [ \stemDown a16 \stemDown b8. \stemDown
        cis16 ] \stemDown d8 ) r8 r4 \stemDown g,8. ( [ \stemDown a16
        \stemDown b8. \stemDown cis16 ] \stemDown d8 ) r8 r4         \stemDown <cis, e a>4 _5 \stemDown <cis e a>4 \stemDown <d fis
            a>4 _4 \stemDown <d fis a>4 \stemUp <a cis e>8 _5 r8
        \stemDown e'16 ( ^1 [ \stemDown cis16 \stemDown e16 \stemDown
        cis16 ] \stemUp a8 ) r8 r4 }
    \repeat volta 2 {
        \stemDown a'4 ( _3 \stemDown bes4 _2 \stemDown a4 _1 \stemDown
        gis4 _2 \stemDown a4 _1 \stemDown e4 _2 \stemUp cis4
        _3 \stemUp a4 _5 \stemDown d4 ^2 \stemUp a4 \stemDown d4 ^3
        \stemDown f4 ^1 \stemDown e4 ^2 \stemUp cis4 \stemUp a8 ) r8 r4
        \stemDown <fis' a d>4 _4 \stemDown <fis a d>4 \stemDown
        <fis a d>8 r8 r4 \stemDown <g b e>4 _5 \stemDown <g b e>4
        \stemDown <g b e>8 r8 r4 \stemDown <a d fis>8 _2 r8 \stemDown <a
            d fis>8 r8 \stemDown <a cis g'>8 _3 r8 \stemDown <a cis g'>8
        r8 \stemDown <d fis>8 _2 _4 r8 \stemDown a16 ( _1 [ \stemDown
        fis16 \stemDown a16 \stemDown fis16 ] \stemDown d8 ) r8 r4 }
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
                \context Voice = "PartPOneVoiceTwo" {  \PartPOneVoiceTwo }
                >>
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    \midi {\tempo 4 = 108 }
    }
