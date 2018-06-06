pragma solidity ^0.4.0;
contract Crow {

    struct Worker {
        //Worker 身份的数据，其中key为类型
        //bool register_tag;
        mapping(uint=>uint) job_types;          // key 为类型， value为得分  
        mapping(uint=>bool) receive_mark;       // 是否接受推送的接受标记  
        mapping(uint=>uint) receive_amount;    // 待完成单数量 
        // 任务发布者角色数据 
        mapping(uint=>uint) release_amount;    // 发布待结束的任务数量 
    }
    
    struct S_Task {
        //任务发布时需要更新的变量 
        uint deadline;
        address owner;
        uint owner_deposit;
        uint worker_number;
        uint per_price;
        uint per_deposit;
        uint _type;
        string  overview;
        uint worker_number_now;
        bool ended;
    
        //worker接受任务时需要更新的数据
        //uint worker_number_now;
        address[] accept;
        string[] submit;
        //bool[] submit_tag;
        //bool[] envalue;
        uint[] workers_deposit;
        uint8[] deposit_mark;
		//deposit_mark对应值的解释说明，其中键值为接受该任务的用户在该任务中的编号：
		//1:对应用户缴纳押金，成功接受该任务，单未提交
		//2:对应用户按时提交任务结果
		//3:对应用户押金将被罚没，任务提交过时
		//4:对应用户任务被发布者评价，押金退还，工作报酬支付
		//5:对应用户押金罚没，且已经被支付给任务发布者，这也标志着任务的最终结束
        mapping(address => uint) tk_user_id;
        
        //任务提交时需要修改的数据
        //string[] submit;
        //bool[] submit_tag;
        
        //任务评估时需要修改的数据 
        //bool[] envalue;
        
        //publisher withdraw时需要修改的数据 
        //bool ended;
    }

    uint public type_number;		//任务类型的总数
    address chairperson;	//创建合约者的公钥，用于控制合约中任务类型的修改
    uint public registerworker_unm=0;			    //注册的用户总数
    mapping(address => uint) worker_ID;		//用户地址和用户uint类型编号的映射
    Worker[] workers;						//用户数组
    S_Task[] tasks;							//任务数组
    uint public s_count=0;							//发布的任务总数
    function Crow() public {
        chairperson = msg.sender;
        type_number=2;
        Worker temp;
        // temp.job_types[0]        =1;
        // temp.receive_mark[0]     =true;
        // temp.receive_amount[0]   =0;
        // temp.release_amount[0]   =0;
        workers.push(temp);
        worker_ID[0x0000000000000000000000000000000000000000000000000000000000000000]=registerworker_unm;
        registerworker_unm++;
    }

// 注册函数 
    function  Worker_register(uint j) public returns(uint rg_type, uint re_user_id) {
        require(j<type_number,"type error");
        uint i;
        if(uint(worker_ID[msg.sender])!=0){
            i = worker_ID[msg.sender];
            workers[i].job_types[j]        =1;
            workers[i].receive_mark[j]     =true;
            workers[i].receive_amount[j]   =0;
            workers[i].release_amount[j]   =0;
            return (j,i);
        }else {
            Worker temp;
            // temp.job_types[j]        =1;
            // temp.receive_mark[j]     =true;
            // temp.receive_amount[j]   =0;
            // temp.release_amount[j]   =0;
            workers.push(temp);
            worker_ID[msg.sender]=registerworker_unm;
            //i=registerworker_unm;
            registerworker_unm++;
            i = worker_ID[msg.sender];
            workers[i].job_types[j]        =1;
            workers[i].receive_mark[j]     =true;
            workers[i].receive_amount[j]   =0;
            workers[i].release_amount[j]   =0;
            return (j,registerworker_unm-1);
        }    
    }

//任务发布函数     
    function Task_release(string _Overview, uint _task_types, uint end_date, uint w_number, uint _per_price, uint _per_deposit) 
    public payable  returns(uint tr_user_id, uint task_id ) {
        require(_task_types<=type_number); //  任务类型控制 
        //require(end_data > now, "now");
        require(_per_price*w_number<=msg.value, "value not enought");
        require(w_number>0);
        S_Task temp;
        tasks.push(temp);
        tasks[s_count].owner_deposit = msg.value;
        tasks[s_count]._type = _task_types;
        tasks[s_count].deadline=end_date+now;
        tasks[s_count].owner = msg.sender;
        tasks[s_count].overview = _Overview;
        tasks[s_count].ended = false;
        tasks[s_count].worker_number=w_number;
        tasks[s_count].per_price = _per_price;
        tasks[s_count].per_deposit=_per_deposit;
        tasks[s_count].worker_number_now=0;
        // tasks.push(S_Task({
        //     deadline:end_data+now,
        //     owner:msg.sender, 
        //     worker_number:w_number,
        //     _type:_task_types,
        //     overview:_Overview,
        //     worker_number_now:0,
        //     ended:false
        // }));
        workers[worker_ID[msg.sender]].release_amount[_task_types]+=1;
        for(uint i=1; i<registerworker_unm; i++){
            if(workers[i].receive_mark[_task_types]){
                // inform workers
            }
        }
        s_count++;
        //send deposit
        return (worker_ID[msg.sender], s_count-1);
    }

//任务接受函数     
    function Task_accept(uint i) public payable returns(uint tc_user_id){
        require(worker_ID[msg.sender]!=0, "worker_ID");
        uint j=worker_ID[msg.sender];
        uint k=tasks[i]._type;
        require(workers[j].receive_mark[k], "worker_type");
        require(tasks[i].worker_number_now < tasks[i].worker_number,"worker_number");
        require(tasks[i].deadline > now);
        require(tasks[i].per_deposit<=msg.value,"value error");
        tasks[i].tk_user_id[msg.sender]=tasks[i].worker_number_now;
        tasks[i].worker_number_now=tasks[i].accept.push(msg.sender);
        //tasks[i].envalue.push(false);
        tasks[i].submit.push("");
        //tasks[i].submit_tag.push(false);
        tasks[i].workers_deposit.push(msg.value);
        tasks[i].deposit_mark.push(1);
        
        workers[worker_ID[msg.sender]].receive_amount[tasks[i]._type]+=1;
        //send deposit
        return ( worker_ID[msg.sender]);
    }

//任务提交函数     
    function Task_submit(uint i, string _submit) public returns(string info, uint task_workerid){
        if(tasks[i].deadline>now){
            bool tag=false;
            for(uint j=0; j<tasks[i].worker_number_now; j++){
                if(tasks[i].accept[tasks[i].tk_user_id[msg.sender]]==msg.sender){
                    tag = true;
                    break;
                }
            }
            if(tag){
                //require(tasks[i].submit[j-1]!="");
                tasks[i].submit[j] =_submit;
                //tasks[i].submit_tag[j] =true;
                tasks[i].deposit_mark[j]= 2;
                //inform boss
                return("submit success!",j);
            }else {
                //inform error(don't accept the task)
                return ("error ,you did not accept the task.",0);
            }
        }else{
            // send penalty
            tasks[i].deposit_mark[tasks[i].tk_user_id[msg.sender]]=3;
            return ("it's too late to submit the task!",0);
        }
    }
//获取该保证金数额
    function Task_getsubmit(uint i, uint j)public view returns(string){
        require(i<s_count);
        return tasks[i].submit[j];
    }

//任务评价函数     
    function Task_evalue(uint i, uint score, uint worker_id) public returns (string info, uint _score){
        require(!tasks[i].ended,"it is not ended of the task");
        require(msg.sender==tasks[i].owner,"you are not the owner of the task");
        //require(tasks[i].deposit_mark[worker_id]==1,"deposit_mark error");
        uint user_id=worker_ID[tasks[i].accept[worker_id]];
        require(tasks[i].deposit_mark[worker_id]==2,"deposit_mark error");
        //tasks[i].envalue[worker_id]=true;
        require(score<5);
        workers[user_id].job_types[tasks[i]._type]+=score;
        workers[user_id].receive_amount[tasks[i]._type]-=1;
        workers[worker_ID[msg.sender]].release_amount[tasks[i]._type]-=1;
        
        //payment and return deposit
        tasks[i].accept[worker_id].transfer(tasks[i].workers_deposit[worker_id]+tasks[i].per_price);
        tasks[i].deposit_mark[worker_id]=4;
        tasks[i].owner_deposit-=tasks[i].per_price;
        return ("wvalue success!", workers[user_id].job_types[tasks[i]._type]);
    }

//发布者取回押金及违约金的函数     
    function publisher_withdraw(uint i) public payable returns(uint wks_num, string info) {
        require(tasks[i].deadline<now,"now_time");
        require(tasks[i].owner==msg.sender,"owner");
        require(!tasks[i].ended,"ended");
        for(uint k=0; k<tasks[i].worker_number_now;k++){
            if(tasks[i].deposit_mark[k]==2){
                //inform worker[k] envalue is false
                return (tasks[i].worker_number_now, "worker did not envalue ");
            }
        }
        tasks[i].ended=true;
        uint drawback=0;
        for(uint j=0;j<tasks[i].worker_number_now;j++){
            if(tasks[i].deposit_mark[j]==1||tasks[i].deposit_mark[j]==3){
                tasks[i].deposit_mark[j]==5;
                drawback+=tasks[i].workers_deposit[j];
                //send the deposit to publisher
            }
        }
        // uint drawback= address(this).balance;
        // msg
        drawback+=tasks[i].owner_deposit;
        msg.sender.transfer(drawback);
        return (tasks[i].worker_number_now, "withdraw success");
        //return deposit
    }

}

    


