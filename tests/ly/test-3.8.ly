\version "2.20.0"
% automatically converted by musicxml2ly from /home/xunan/data/score/巴赫初级钢琴曲集/xml/20.加伏特舞曲.xml
\pointAndClickOff

\header {
    encodingsoftware =  "Finale 2014 for Windows"
    encodingdate =  "2017-03-08"
    subtitle =  "A study in legato touch and independence of each hand"
    composer =  \markup \column {
        \line { "J.S.BACH"}
        \line { "BWV 808"} }
    
    title =  \markup \column {
        \line { "加 伏 特 舞 曲"}
        \line { "      Gavotte"} }
    
    }

#(set-global-staff-size 20.6625714286)
\paper {
    
    paper-width = 20.99\cm
    paper-height = 29.69\cm
    top-margin = 0.99\cm
    bottom-margin = 1.68\cm
    left-margin = 0.99\cm
    right-margin = 0.9\cm
    between-system-space = 2.42\cm
    page-top-space = 1.5\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative g'' {
    \repeat volta 2 {
        \repeat volta 2 {
            \clef "treble" \key bes \major \time 2/2 | % 1
            \stemDown g4 ( ^2 ^\markup{ \bold {Allegro} } _\f \stemDown
            bes8 [ \stemDown a8 ) ] s2 | % 2
            \stemDown bes4 ( \stemDown g8 [ \stemDown d8 ) ] \stemDown
            a'4 ( \stemDown fis8 [ \stemDown d8 ) ] | % 3
            \stemDown g2 _\> _\mf \stemDown es4 ( ^4 -\! \stemDown c8 [
            \stemDown a8 ) ] | % 4
            \stemDown d4 ( ^4 \stemUp bes8 [ \stemUp g8 ) ] \stemDown c8
            ^4 [ \stemDown a8 ] \stemDown d4 \break | % 5
            \stemUp bes4 ( _\f \stemUp a8 [ \stemUp g8 ) ] \stemDown g'4
            ( ^2 \stemDown bes8 [ \stemDown a8 ) ] | % 6
            \stemDown bes4 ( \stemDown g8 [ \stemDown d8 ) ] \stemDown
            a'4 ( \stemDown fis8 [ \stemDown d8 ) ] | % 7
            \stemDown g4. ^4 _\> _\mf \stemDown f8 ^3 -\! \stemDown es8
            ( [ \stemDown d8 ^1 \stemDown c8 ^2 \stemDown bes8 ) ^1 ] | % 8
            \stemDown a'8 ( ^4 [ \stemDown bes8 ) ^5 \stemDown d,8 (
            \stemDown es8 ) ] \stemDown f8 ( [ \stemDown c8 ^1 ]
            \stemDown d4 ) ^4 \break }
        \alternative { {
                | % 9
                \grace { \stemUp c8 ( } \stemDown bes2 ) }
            } s2 }
    \alternative { {
            | \barNumberCheck #10
            \grace { \stemUp c8 ( } \stemDown bes2 ) }
        } s2 \repeat volta 2 {
        | % 11
        \stemDown d4 ( ^2 _\p \stemDown f8 [ \stemDown es8 ) ] s2 | % 12
        \stemDown f4 ( \stemDown d8 [ \stemDown bes8 ) ] \stemDown g'4 (
        \stemDown es8 ^2 [ \stemDown bes8 ) ] \break | % 13
        \stemDown f'2 ^4 \stemDown bes8 ( ^4 [ \stemDown a8 \stemDown g8
        \stemDown a8 ] | % 14
        \stemDown bes8 [ \stemDown g8 ^3 \stemDown e8 \stemDown c8 ) ]
        \stemDown bes'8 ( ^4 [ \stemDown a8 \stemDown g8 \stemDown a8 ]
        | % 15
        \stemDown bes8 [ \stemDown a8 \stemDown g8 _\markup{
            \bold\italic {cresc.} } \stemDown f8 ) ] \stemDown g8 ( ^4 [
        \stemDown f8 \stemDown e8 \stemDown f8 ] | % 16
        \stemDown g8 ^5 [ \stemDown e8 \stemDown cis8 \stemDown a8 ) ]
        \stemDown g'8 ( ^4 [ \stemDown f8 \stemDown e8 \stemDown f8 ]
        \pageBreak | % 17
        \stemDown g8 [ _\f \stemDown f8 \stemDown e8 \stemDown d8 ) ]
        \stemDown a'4 ( ^. ^5 \stemDown a4 ) ^. ^3 | % 18
        a1 ~ ^\trill _2 | % 19
        \stemDown a8 [ \stemDown f8 ( \stemDown g8 \stemDown a8 ]
        \stemDown bes8 [ \stemDown a8 \stemDown g8 \stemDown f8 ] |
        \barNumberCheck #20
        \stemDown e8 ^4 [ _\> \stemDown d8 \stemDown cis8 \stemDown d8
        ^1 ] \stemDown g8 [ \stemDown f8 \stemDown e8 \stemDown f8 ] -\!
        \break | % 21
        \stemDown d2 ) _\mf \stemDown d4 ( ^2 \stemDown f8 [ \stemDown
        es8 ) ] | % 22
        \stemDown f4 ( \stemDown d8 [ \stemDown b8 ) ] \stemDown as'4 (
        ^5 \stemDown f8 [ \stemDown d8 ) ] | % 23
        \stemDown es4 ( ^4 \stemUp c8 [ \stemUp g8 ) ] \stemDown g'4 (
        \stemDown es8 [ \stemDown c8 ) ] | % 24
        \stemDown d4 ( ^4 \stemUp bes8 [ \stemUp g8 ) ] \stemDown g'4 (
        \stemDown d8 [ \stemDown bes8 ) ] \break | % 25
        \stemDown c4 ( ^4 \stemUp a8 ^2 [ \stemUp fis8 ) ^1 ] \stemDown
        es'4 ( ^5 _\markup{ \bold\italic {dim.} } \stemDown c8 ^3 [
        \stemDown a8 ) ^1 ] | % 26
        \stemDown d4 ( ^4 \stemUp bes8 [ \stemUp g8 ) ] \stemUp c8 ( ^4
        [ \stemUp a8 \stemUp bes8 ^3 \stemUp g8 ] | % 27
        \stemUp a8 ) ( ^4 [ _\< \stemUp d,8 _1 \stemUp e8 \stemUp fis8 ]
        \stemUp g8 ^1 [ \stemUp a8 \stemUp bes8 \stemUp g8 ] -\! | % 28
        \stemDown es'8 ^5 [ _\> \stemDown c8 ^3 \stemDown d8 ^4
        \stemDown bes8 ^2 ] \stemUp c8 [ \stemUp a8 \stemUp bes8 _4 -\!
        \stemUp g8 ] \break | % 29
        \stemUp a4 ) \stemUp d,4 \stemUp g4 ( ^2 \stemUp bes8 ^4 [
        \stemUp a8 ) ] | \barNumberCheck #30
        \stemUp bes8 ( ^4 [ \stemUp fis8 \stemUp g8 \stemUp d8 ) ]
        \stemUp b'8 ( ^5 [ \stemUp f8 _\markup{ \bold\italic {cresc.} }
        \stemUp g8 \stemUp d8 ) ] | % 31
        \stemUp c'8 ^5 [ \stemUp d,8 \stemUp es8 \stemUp g8 ^1 ]
        \stemDown c8 ^3 [ \stemDown g8 \stemDown d'8 \stemDown g,8 ] | % 32
        \stemDown es'8 ( ^4 [ \stemDown b8 \stemDown c8 \stemDown g8 ) ]
        \stemDown e'8 ( ^5 [ \stemDown bes8 \stemDown c8 \stemDown g8 )
        ] \pageBreak | % 33
        \stemDown f'8 [ \stemDown g,8 ( \stemDown a8 \stemDown c8 ^1 ]
        \stemDown fis8 ^3 [ \stemDown c8 \stemDown g'8 \stemDown c,8 ) ]
        | % 34
        \stemDown a'8 ( [ \stemDown e8 \stemDown fis8 \stemDown d8 ) ]
        \stemDown bes'8 ( ^4 [ \stemDown fis8 \stemDown g8 \stemDown d8
        ) ] | % 35
        \stemDown c'8 ( [ _\f \stemDown a8 \stemDown d,8 \stemDown c'8
        _5 ] \stemDown bes8 ^3 [ \stemDown a8 \stemDown g8 \stemDown fis8
        ^2 ] | % 36
        \stemDown g8 ^3 [ \stemDown d8 ^1 \stemDown es8 ^3 \stemDown c8
        ^1 ] \stemDown bes4 ^3 \stemUp a8 _\prall ^1 ^3 ^2 [ \stemUp g8
        _1 ] | % 37
        \stemUp g2 ) ^2 }
    }

PartPOneVoiceTwo =  \relative g, {
    \repeat volta 2 {
        \repeat volta 2 {
            \clef "bass" \key bes \major \time 2/2 \stemUp g4 \stemUp d'4
            _2 s2 \stemDown g4 \stemDown bes4 _3 \stemDown c4 \stemDown
            d4 \stemDown es8 _2 [ \stemDown f8 \stemDown es8 \stemDown d8
            _1 ] \stemDown c8 [ \stemDown bes8 \stemDown a8 \stemDown c8
            _1 ] \stemDown bes8 [ \stemDown a8 \stemDown g8 \stemDown
            bes8 ] \stemDown a8 _1 [ \stemDown g8 \stemDown fis8
            \stemDown d8 ] \break \stemDown g4 _1 \stemDown d4 _2
            \stemUp bes4 _4 \stemDown d4 \stemDown g4 \stemDown bes4 _3
            \stemDown c4 \stemDown d4 \stemDown es8 _2 [ \stemDown f8
            \stemDown es8 \stemDown d8 _1 ] \stemDown c8 [ \stemDown bes8
            \stemDown a8 _1 \stemDown g8 ] \stemDown f4 \stemDown g4
            \stemDown es4 \stemDown f4 _1 \break }
        \alternative { {
                \stemUp bes,8 _3 [ \stemUp c8 \stemUp bes8 \stemUp a8 ]
                }
            } s2 }
    \alternative { {
            \stemDown bes8 _5 [ \stemDown f'8 ( _2 \stemDown g8 _1
            \stemDown a8 ) _3 ] }
        } s2 \repeat volta 2 {
        \stemDown bes4 _2 \stemDown c4 s2 \stemDown d4 _2 \stemDown bes4
        _4 \stemDown es4 _2 \stemDown c4 \break \stemDown d8 ( _1 [
        \stemDown c8 \stemDown bes8 \stemDown a8 ) ] \stemDown g4 _1
        \stemDown f4 \stemDown e4 \stemUp c4 \stemDown d4 \stemDown e4
        \stemDown f4 ( \stemDown g8 [ \stemDown a8 _3 ] \stemDown bes4 )
        \stemDown g4 _1 \stemDown e4 _2 \stemUp a,4 \stemUp b4 \stemUp
        cis4 \pageBreak \stemUp d4 _1 \stemUp d,4 \stemDown d''4 ( _2
        \stemDown f8 [ \stemDown e8 ) ] \stemDown f4 ( \stemDown d8 [
        \stemDown a8 ) ] \stemDown e'4 ( \stemDown cis8 [ \stemDown a8 )
        ] \stemDown d2 _1 \stemDown g,4 ( _4 \stemDown a4 \stemDown bes4
        \stemDown g4 \stemDown a4 _1 \stemUp a,4 _5 _2 \break \stemUp d,8
        ) [ \stemUp d'8 ( _1 \stemUp es8 _3 \stemUp f8 ] \stemDown g4 )
        ^. \stemDown g4 ^. _2 g1 ~ -\markup { \flat } \trill _3 _2
        \stemDown g2 \stemDown g4 ^. _1 \stemDown g4 ^. _3 \stemDown g2
        _2 \stemDown g4 ^. _1 \stemDown g4 ^. _3 \break \stemDown g2 _2
        ^\p \stemDown g8 _1 [ \stemDown g8 _4 \stemDown g8 _3 \stemDown
        g8 _2 ] \stemDown g8 _1 [ \stemDown g8 _4 \stemDown g8 _3
        \stemDown g8 _2 ] \stemDown g8 ( _1 [ \stemDown fis8 _2 ]
        \stemDown g4 ) \stemDown d4 _2 \stemUp c4 \stemUp bes4 \stemDown
        d4 _1 \stemUp fis,4 \stemDown d'4 \stemUp g,4 \stemDown d'4
        \break \stemUp d,4 \stemUp d'8 ( [ \stemUp c8 ] \stemUp bes4 )
        \stemUp a4 _1 \stemUp g4 r4 \stemUp f4 r4 \stemUp es4 \stemDown
        g'8 ( [ \stemDown f8 ] \stemDown es4 \stemDown d4 ) _1 \stemUp c4
        r4 \stemUp bes4 r4 \pageBreak | % 33
        \stemUp a4 ^\mf \stemDown c'8 ( [ ^\markup{ \bold\italic
            {cresc.} } \stemDown bes8 ] \stemDown a4 ) \stemDown g4 _1
        \stemDown fis4 r4 \stemDown e4 r4 \stemDown d4 \stemDown fis4 _2
        \stemDown g4 \stemDown a4 _4 \stemDown bes4 \stemDown c4
        \stemDown d4 \stemDown d,4 _5 _2 \stemUp g,2 }
    }


% The score definition
\score {
    <<
        
        \new StaffGroup \with { systemStartDelimiter =
            #'SystemStartBrace }
        
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
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    %  \midi {\tempo 4 = 120 }
    }
