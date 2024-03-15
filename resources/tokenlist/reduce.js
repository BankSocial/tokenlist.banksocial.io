const tokenList = require("./old-tokenlist.json");
async function reduceTokenList() {
    const response = await fetch("https://api.saucerswap.finance/tokens/known");
    const data = await response.json();
    const oldLength = Object.entries(tokenList).length;

    // remove tokenList tokens where are not in the known list
    // tokenList is Object key value pair
    // data is array of objects
    Object.entries(tokenList).forEach(([tokenName, token]) => {
        // find if matching token is in data
        if (token.type == "HEDERA") {
            const matchingToken = data.find((knownToken) => {
                return knownToken.id === token.id;
            });
            if (!matchingToken) {
                console.log("removing token", tokenName, token);
                delete tokenList[tokenName];
            }
        }
    });
    return tokenList;
}
reduceTokenList().then((list) => {
    // print to tokenList.json
    const fs = require("fs");
    fs.writeFileSync("tokenlist.json", JSON.stringify(list, null, 2));
    console.log("done");
});
