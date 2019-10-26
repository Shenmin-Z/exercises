import           Test.Hspec
import           Parser

main :: IO ()
main = hspec $ do
  describe "Pre-process" $ context "betweenQuotes" $ do
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
  describe "To tags" $ context "toTags" $ do
    let s1 = ""
        s2 = "<a"
        s3 = "<a<"
        s4 = "a<a"
        s5 = "a>"
        s6 = ">a>"
        s7 = ">a<"
        s8 = "a<"
    it "aa" $ 1 `shouldBe` 1
