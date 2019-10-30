import           Test.Hspec
import           Parser

rawTagsCharOnly :: Either String [RawTag] -> Either String [String]
rawTagsCharOnly cs = do
  rawTags <- cs
  return $fmap toString rawTags

closingTagCharOnly :: Either String ClosingTag -> Either String String
closingTagCharOnly t = do
  tag <- t
  return $ toString tag

main :: IO ()
main = hspec $ do
  describe "Pre-process: betweenQuotes" $ do
    let ci1 = CharInfo '<' (1, 2) "\"<" --"<
        ci2 = CharInfo '<' (1, 2) "\"<\"" --"<"
        ci3 = CharInfo '<' (1, 3) " \"<" -- "<
        ci4 = CharInfo '<' (1, 3) " \"<\"" -- "<" 
        ci5 = CharInfo '<' (1, 2) "\"<\\\"" --"<\"
        ci6 = CharInfo '<' (1, 2) "\"<\\\"\"" --"<\""
        ci7 = CharInfo '<' (1, 2) "'<\\''" --'<\''
        ci8 = CharInfo '<' (1, 2) "'<\\'" --'<\'
    it "1" $ betweenQuotes ci1 `shouldBe` False
    it "2" $ betweenQuotes ci2 `shouldBe` True
    it "3" $ betweenQuotes ci3 `shouldBe` False
    it "4" $ betweenQuotes ci4 `shouldBe` True
    it "5" $ betweenQuotes ci5 `shouldBe` False
    it "6" $ betweenQuotes ci6 `shouldBe` True
    it "7" $ betweenQuotes ci7 `shouldBe` True
    it "8" $ betweenQuotes ci8 `shouldBe` False
  describe "To tags: toTags" $ do
    let s1  = ""
        s2  = "<a"
        s3  = "<a<"
        s4  = "a<a"
        s5  = "a>"
        s6  = ">a>"
        s7  = ">a<"
        s8  = "a<"
        s9  = "<<a>"
        s10 = "<a>>"
        s11 = "<a<a>>"
        s12 = "<a><"

        ss1 = "<><>"
        ss2 = "<>a<>"
        ss3 = "<a>a<>"
        ss4 = "<a>a</>"
        ss5 = "<'<'>a</>"
        ss6 = "<a b='c\\<'>123</a>"
        ss7 = " <a>\n<b>\n\t 888 </b>\n</a\n>\n "
    it "1" $ toTags' s1 `shouldBe` Right []
    it "2" $ toTags' s2 `shouldBe` Left (printError (toCharInfo s2 !! 1))
    it "3" $ toTags' s3 `shouldBe` Left (printError (toCharInfo s3 !! 2))
    it "4" $ toTags' s4 `shouldBe` Left (printError (toCharInfo s4 !! 1))
    it "5" $ toTags' s5 `shouldBe` Left (printError (toCharInfo s5 !! 1))
    it "6" $ toTags' s6 `shouldBe` Left (printError (toCharInfo s6 !! 0))
    it "7" $ toTags' s7 `shouldBe` Left (printError (toCharInfo s7 !! 0))
    it "8" $ toTags' s8 `shouldBe` Left (printError (toCharInfo s8 !! 1))
    it "9" $ toTags' s9 `shouldBe` Left (printError (toCharInfo s9 !! 1))
    it "10" $ toTags' s10 `shouldBe` Left (printError (toCharInfo s10 !! 3))
    it "11" $ toTags' s11 `shouldBe` Left (printError (toCharInfo s11 !! 2))
    it "12" $ toTags' s12 `shouldBe` Left (printError (toCharInfo s12 !! 3))

    it "1" $ rawTagsCharOnly (toTags' ss1) `shouldBe` Right ["<>", "<>"]
    it "2" $ rawTagsCharOnly (toTags' ss2) `shouldBe` Right ["<>", "a", "<>"]
    it "3" $ rawTagsCharOnly (toTags' ss3) `shouldBe` Right ["<a>", "a", "<>"]
    it "4" $ rawTagsCharOnly (toTags' ss4) `shouldBe` Right ["<a>", "a", "</>"]
    it "5" $ rawTagsCharOnly (toTags' ss5) `shouldBe` Right
      ["<'<'>", "a", "</>"]
    it "6" $ rawTagsCharOnly (toTags' ss6) `shouldBe` Right
      ["<a b='c\\<'>", "123", "</a>"]
    it "7" $ rawTagsCharOnly (toTags' ss7) `shouldBe` Right
      [" ", "<a>", "\n", "<b>", "\n\t 888 ", "</b>", "\n", "</a\n>", "\n "]
  describe "Inside tag" $ do
    let s1 = "lalala"
        s2 = "<>"
        s3 = "</>" --closing
        s4 = "</a>"
        s5 = "</ a>"
        s6 = "</ a >"
        s7 = "</ abc >"
        s8 = "</ a b>"
    it "1" $ isTag (toCharInfo s1) `shouldBe` False
    it "2" $ isTag (toCharInfo s2) `shouldBe` True
    it "2" $ isClosingTag (toCharInfo s2) `shouldBe` False
    it "3" $ isTag (toCharInfo s3) `shouldBe` True
    it "3" $ isClosingTag (toCharInfo s3) `shouldBe` True
    it "4" $ isTag (toCharInfo s4) `shouldBe` True
    it "4" $ isClosingTag (toCharInfo s4) `shouldBe` True
    it "5" $ isClosingTag (toCharInfo s5) `shouldBe` True
    it "6" $ isClosingTag (toCharInfo s6) `shouldBe` True
    it "7" $ isClosingTag (toCharInfo s7) `shouldBe` True
    it "8" $ isClosingTag (toCharInfo s8) `shouldBe` True
    it "3" $ closingTagCharOnly (parseClosing $toCharInfo s3) `shouldBe` Right
      ""
    it "4" $ closingTagCharOnly (parseClosing $toCharInfo s4) `shouldBe` Right
      "a"
    it "5" $ closingTagCharOnly (parseClosing $toCharInfo s5) `shouldBe` Right
      "a"
    it "6" $ closingTagCharOnly (parseClosing $toCharInfo s6) `shouldBe` Right
      "a"
    it "7" $ closingTagCharOnly (parseClosing $toCharInfo s7) `shouldBe` Right
      "abc"
    it "8" $ closingTagCharOnly (parseClosing $toCharInfo s8) `shouldBe` Left
      "Parsing error: \"b\" at :1:6\n\"</ a b>\""
