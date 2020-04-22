\version "2.20.0"
% automatically converted by musicxml2ly from ./temp/xml2ly-5MjE5MjAyND.xml

\header {
    encodingsoftware =  "Finale 2014.5 for Mac"
    encodingdate =  "2017-06-13"
    subtitle =  "The Marines' Hymn"
    title =  "海军赞歌"
    }

#(set-global-staff-size 22.7288571429)
\paper {
    
    paper-width = 21.0\cm
    paper-height = 29.71\cm
    top-margin = 0.99\cm
    bottom-margin = 1.67\cm
    left-margin = 0.99\cm
    right-margin = 0.89\cm
    between-system-space = 2.78\cm
    page-top-space = 1.95\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative c' {
    \repeat volta 2 {
        \clef "treble" \key c \major \numericTimeSignature\time 4/4 | % 1
        \mark \markup { \box { A } } \mark \markup { \box { 段 } }
        ^\markup{ \bold {March tempo 进行曲速度} } | % 1
        r4 s2. | % 2
        <c e g>1 ^1 ^3 ^5 | % 3
        r4 r8 \stemUp c8 r2 | % 4
        \stemUp <c e g>4 r4 \stemUp <b f' g>4 r4 | % 5
        r4 \stemUp <c e g>4 \stemUp <c e g>4 }
    s4 | % 6
    \mark \markup { \box { B } } \mark \markup { \box { 段 } } | % 6
    \stemDown c'8 ( ^5 [ _\f \stemDown b8 ] s2. | % 7
    \stemUp a4 \stemUp f4 \stemUp a4 \stemUp f4 | % 8
    \stemUp g4. \stemUp a8 \stemUp g4 ) \stemDown c8 ( [ \stemDown b8 ]
    | % 9
    \stemUp a4 \stemUp f4 \stemUp a4 \stemDown c4 | \barNumberCheck #10
    \stemUp g2. ) s4 | % 11
    \mark \markup { \box { A } } \mark \markup { \box { 段 } } | % 11
    r4 s2. | % 12
    <c, e g>1 | % 13
    r4 r8 \stemUp c8 r2 | % 14
    \stemUp <c e g>4 r4 \stemUp <b f' g>4 r4 | % 15
    r4 \stemUp <c e g>4 _. \stemUp <c e g>4 _. \bar "|."
    }

PartPOneVoiceOneChords =  \chordmode {
    \repeat volta 2 {
        | % 1
        s1 | % 2
        c1:5 | % 3
        s4 s8 s8 s2 | % 4
        s4 s4 g4:7 s4 | % 5
        c4:5 s4 s4 }
    s4 | % 6
    s8 s8*7 | % 7
    f4:5 s4 s4 s4 | % 8
    c4.:5 s8 s4 s8 s8 | % 9
    f4:5 s4 s4 s4 | \barNumberCheck #10
    c2.:5 s4 | % 11
    s1 | % 12
    s1 | % 13
    s4 s8 s8 s2 | % 14
    s4 s4 g4:7 s4 | % 15
    c4:5 s4 s4 \bar "|."
    }

PartPOneVoiceTwo =  \relative c {
    \repeat volta 2 {
        \clef "bass" \key c \major \numericTimeSignature\time 4/4
        \stemDown c8 ( _5 [ ^\mf \stemDown e8 ] s2. \stemDown g4
        \stemDown g4 \stemDown g4 \stemDown g4 \stemDown g4. r8
        \stemDown g4 ) \stemDown e8 ( _3 [ \stemDown f8 ] \stemDown g4
        \stemDown g4 \stemDown f4 \stemDown d4 \stemUp c2. ) }
    s4 r4 s2. \stemDown <c f a>4 ^. r4 \stemDown <c f a>4 ^. r4
    \stemDown <c e g>4 ^. \stemDown <c e g>4 ^. \stemDown <c e g>4 ^. r4
    \stemDown <c f a>4 ^. r4 \stemDown <c f a>4 ^. r4 \stemDown <c e g>4
    ^. \stemDown <c e g>4 ^. \stemDown <c e g>4 ^. s4 \stemDown c8
    ( _5 [ ^\mf \stemDown e8 ] s2. \stemDown g4 \stemDown g4 \stemDown g4
    \stemDown g4 \stemDown g4. r8 \stemDown g4 ) \stemDown e8 ( _3 [
    \stemDown f8 ] \stemDown g4 \stemDown g4 \stemDown f4 \stemDown d4
    \stemUp c2. ) \bar "|."
    }


% The score definition
\score {
    <<
        
        \context ChordNames = "PartPOneVoiceOneChords" { \PartPOneVoiceOneChords}
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
    \midi {\tempo 4 = 120 }
    }
