//Crow
// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import crow_artifacts from '../../build/contracts/Crow.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Crow = contract(crow_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var dp;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Crow.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },
  
  //用户密钥切换
  change_keyid: function() {
    var self = this;

    var keyid = parseInt(document.getElementById("keyid").value);
    //var receiver = document.getElementById("receiver").value;

    this.setStatus_ck("注册中，请等待……");
	if(keyid<=accounts.length){
		account=accounts[keyid];
		this.setStatus_ck("切换成功");
		self.refreshBalance();
	}else{
		this.setStatus_ck("编号超出密钥列表界限");
	}
  },
//切换密钥状态设置
  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  }, 
//切换密钥状态设置
  setStatus_ck: function(message) {
    var status = document.getElementById("status_ck");
    status.innerHTML = message;
  },  
//注册状态设置
  setStatus_rg: function(message) {
    var status = document.getElementById("status_rg");
    status.innerHTML = message;
  },
//任务发布状态设置
  setStatus_rl: function(message) {
    var status = document.getElementById("status_rl");
    status.innerHTML = message;
  },
//任务接受状态设置
  setStatus_ap: function(message) {
    var status = document.getElementById("status_ap");
    status.innerHTML = message;
  },  
//任务提交状态设置
  setStatus_sb: function(message) {
    var status = document.getElementById("status_sb");
    status.innerHTML = message;
  },  
//任务评估状态设置
  setStatus_ev: function(message) {
    var status = document.getElementById("status_ev");
    status.innerHTML = message;
  },
//任务评估状态设置
  setStatus_wd: function(message) {
    var status = document.getElementById("status_wd");
    status.innerHTML = message;
  },
//获取任务押金数目  
  /* getdeposit: function(){
    var self = this;
    var accept_id = parseInt(document.getElementById("accept_taskid").value);
    //var typeId = parseInt(message);
    //var receiver = document.getElementById("receiver").value;

    this.setStatus_ap("任务信息获取中，请等待……");

    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.Task_getdeposit(accept_id, {from: account,gas:3000000});
    }).then(function(value) {
      self.setStatus_ap("任务信息获取成功！");
	  dp=value.valueOf();
      //self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus_ap("任务信息获取失败; 请查看日志……");
    });  
  },	   */
  
  refreshBalance: function() {
    var self = this;

   /*  var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) { */
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = account;
   /*  }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    }); */
  },
/*re_freshBalance: function() {
    var self = this;

     var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.getdeposit.call(0, {from: account});
    }).then(function(value) { 
      var balance_element = document.getElementById("resoult");
      balance_element.innerHTML =value.valueOf();
     }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    }); 
  },*/
//注册函数调用
  register: function() {
    var self = this;

    var typeId = parseInt(document.getElementById("typeId").value);
    //var receiver = document.getElementById("receiver").value;

    this.setStatus_rg("注册中，请等待……");

    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.Worker_register(typeId, {from: account,gas:3000000});
    }).then(function() {
      self.setStatus_rg("注册成功！");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus_rg("注册出错; 请查看日志……");
    });
  },

  //任务发布函数调用
  task_release: function() {
    var self = this;

    //var typeId = parseInt(document.getElementById("typeId").value);
    var overview = document.getElementById("overview").value;
	var taskType = parseInt(document.getElementById("taskType").value);
    //var receiver = document.getElementById("receiver").value;
	var end_date = parseInt(document.getElementById("end_date").value);
	var w_number = parseInt(document.getElementById("w_number").value);
	var per_price = parseInt(document.getElementById("per_price").value);
	var per_depost = parseInt(document.getElementById("per_depost").value);
	var deposit=w_number*per_price;
    this.setStatus_rl("任务发布中，请等待……");

    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.Task_release(overview,taskType,end_date,w_number,per_price,per_depost, {from: account,value:deposit,gas:3000000});
    }).then(function() {
      self.setStatus_rl("任务发布成功");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus_rl("任务发布出错; 请查看日志……");
    });
  },
  
  //任务接受函数调用
  task_accept: function() {
    var self = this;
    var accept_taskid = parseInt(document.getElementById("accept_taskid").value);
	var accept_deposit = parseInt(document.getElementById("accept_deposit").value);
    //var receiver = document.getElementById("receiver").value;
	
    this.setStatus_ap("任务接受中，请等待……");
	//getdeposit();
    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.Task_accept(accept_taskid, {from: account,value:accept_deposit,gas:3000000});
    }).then(function() {
      self.setStatus_ap("任务接受成功！");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus_ap("任务接受成功！");//"接受任务出错; 请查看日志……"
    });
  },
//任务提交函数调用
  task_submit: function() {
    var self = this;

    var submit_taskid = parseInt(document.getElementById("submit_taskid").value);
    var submit_result = document.getElementById("submit_result").value;

    this.setStatus_sb("任务提交中，请等待……");

    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.Task_submit(submit_taskid, submit_result, {from: account,gas:3000000});
    }).then(function() {
      self.setStatus_sb("任务提交成功！");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus_sb("提交任务出错; 请查看日志……");
    });
  }, 
//任务评估函数调用
  task_evalue: function() {
    var self = this;

    var evalue_taskid = parseInt(document.getElementById("evalue_taskid").value);
	var evalue_workerid = parseInt(document.getElementById("evalue_workerid").value);
	var evalue_score = parseInt(document.getElementById("evalue_score").value);
    //var submit_result = document.getElementById("submit_result").value;

    this.setStatus_ev("评价提交中，请等待……");

    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.Task_evalue(evalue_taskid, evalue_score,evalue_workerid, {from: account,gas:3000000});
    }).then(function() {
      self.setStatus_ev("评价提交成功！");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus_ev("评价提交出错; 请查看日志……");
    });
  }, 
  //任务接受函数调用
  task_withdraw: function() {
    var self = this;

    var withdraw_taskid = parseInt(document.getElementById("withdraw_taskid").value);
    //var receiver = document.getElementById("receiver").value;

    this.setStatus_wd("余额赎回中，请等待……");

    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.publisher_withdraw(withdraw_taskid, {from: account,gas:3000000});
    }).then(function() {
      self.setStatus_wd("余额赎回成功！");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus_wd("余额赎回出错; 请查看日志……");
    });
  },

//  getresult: function() {
//    var self = this;
//    var evalue_taskid = parseInt(document.getElementById("evalue_taskid").value);
//    var meta;
//    Crow.deployed().then(function(instance) {
//      meta = instance;
//      return meta.methods.Task_getdeposit(evalue_taskid, {from: account,gas:3000000});
//    }).then(function(x) {
//      var balance_element = document.getElementById("result");
//      balance_element.innerHTML = x;//.valueOf();
//    }).catch(function(e) {
//      console.log(e);
//      self.setStatus("Error getting balance; see log.");
//    });
//  },
  //注册函数调用
  getresult: function() {
    var self = this;
    var taskid = parseInt(document.getElementById("evalue_taskid").value);
    var workerid = parseInt(document.getElementById("evalue_workerid").value);
    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
	  self.setStatus("结果查询中，请等待……");
      return meta.Task_getsubmit.call(taskid,workerid,{from: account});
    }).then(function(value) {
	  self.setStatus("结果查询成功！");
      var balance_element = document.getElementById("result_id");
      balance_element.innerHTML =value;//.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("结果查询出错，请查看日志……");
    });
  },
//发布函数调用  
   /*  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    Crow.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  } */
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask");
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
