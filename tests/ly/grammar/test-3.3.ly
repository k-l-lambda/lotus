\version "2.20.0"
% automatically converted by musicxml2ly from ./temp/xml2ly-xMjE3NzI5Mz.xml

\header {
    encodingdate =  "2017-12-27"
    encodingdescription =  "Sibelius / MusicXML 3.0"
    title =  "老麦"
    encoder =  star
    composer =  "J Sun"
    encodingsoftware =  "Sibelius 8.1.1"
    }

#(set-global-staff-size 28.5714285714)
\paper {
    
    paper-width = 21.0\cm
    paper-height = 29.7\cm
    top-margin = 1.5\cm
    bottom-margin = 1.5\cm
    left-margin = 1.5\cm
    right-margin = 1.5\cm
    between-system-space = 2.3\cm
    indent = 1.61538461538\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative c' {
    \repeat volta 2 {
        \clef "treble" \key c \major \time 4/4 \omit Staff.TimeSignature
        | % 1
        \stemUp c4 -\markup{ \bold\tiny {1} } \stemUp c4 \stemUp c4 s4*5
        | % 3
        \stemUp e4 -\markup{ \bold\tiny {3} } \stemUp e4 \stemUp d4
        \stemUp d4 | % 4
        c1 }
    | % 5
    s1 | % 6
    \stemUp c4 -\markup{ \bold\tiny {1} } \stemUp c4 \stemUp c2 s2
    \stemUp c4 \stemUp c4 s2 \stemUp c2 | % 9
    \stemUp c4 -\markup{ \bold\tiny {1} } \stemUp c4 \stemUp c4 s4*5 | % 11
    \stemUp e4 \stemUp e4 \stemUp d4 \stemUp d4 | % 12
    c1 \bar "|."
    }

PartPOneVoiceTwo =  \relative g {
    \repeat volta 2 {
        \clef "bass" \key c \major \time 4/4 \omit Staff.TimeSignature
        s2. \stemDown g4 -\markup{ \bold\tiny {4} } | % 2
        \stemDown a4 -\markup{ \bold\tiny {3} } \stemDown a4 -\markup{
            \bold\tiny {3} } \stemDown g2 -\markup{ \bold\tiny {4} }
        s1*2 }
    | % 5
    \stemDown c4 -\markup{ \bold\tiny {1} } \stemDown c4 \stemDown c2 s1
    \stemDown c4 \stemDown c4 s2 \stemDown c4 \stemDown c4 s2 | % 9
    s2. \stemDown g4 -\markup{ \bold\tiny {4} } | \barNumberCheck #10
    \stemDown a4 -\markup{ \bold\tiny {3} } \stemDown a4 -\markup{
        \bold\tiny {3} } \stemDown g2 -\markup{ \bold\tiny {4} } s1*2
    \bar "|."
    }


% The score definition
\score {
    <<
        
        \new StaffGroup \with { systemStartDelimiter =
            #'SystemStartBrace }
        
        <<
            \new PianoStaff
            <<
                \set PianoStaff.instrumentName = "P1"
                
                \context Staff = "1" << 
                    \mergeDifferentlyDottedOn\mergeDifferentlyHeadedOn
                    \context Voice = "PartPOneVoiceOne" {  \PartPOneVoiceOne }
                    >> \context Staff = "2" <<
                    \mergeDifferentlyDottedOn\mergeDifferentlyHeadedOn
                    \context Voice = "PartPOneVoiceTwo" {  \PartPOneVoiceTwo }
                    >>
                >>
            
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    \midi {\tempo 4 = 100 }
    }
