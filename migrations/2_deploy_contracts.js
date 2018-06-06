//var ConvertLib = artifacts.require("./ConvertLib.sol");
var Crow = artifacts.require("./Crow.sol");

module.exports = function(deployer) {
  deployer.deploy(Crow);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
};
