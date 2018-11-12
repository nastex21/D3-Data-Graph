function number(sums) {
    var startCounter = 3;

    var checkStart = function () {

        var counter = startCounter;
        var startArr = [];
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        while (counter > 1) {
            counter--;
            startArr.push(counter);
        }
        console.log(startCounter);
        console.log(sums.length);
        console.log(startArr.length);
        console.log(startArr.reduce(reducer));
        if (startArr.reduce(reducer) !== sums.length) {
            startArr = [];
            startCounter += 1;
            counter = startCounter;
            checkStart();
        } else if (startArr.reduce(reducer) > sums.length) {
            return;
        } else {
            return;
        }
            
        }

    }
    checkStart();

    var count = 1; //start off point... from 1-9
    var checkArr = []; //for check num 

    var generateNums = function () {
        var startNum = Math.abs(sums[0] - count);
        if (checkArr.length == 0) {
            if (startNum >= 10) {
                count++;
                checkArr = [];
                return generateNums();
            } else {
                checkArr.push(count);
                checkArr.push(Math.abs(sums[0] - count));
                return generateNums();
            }
        } else {
            for (var i = 1; i <= startCounter - 2; i++) {
                var numArr = Math.abs(sums[i] - count);
                checkArr.push(numArr);
                if (numArr >= 10) {
                    count++;
                    checkArr = [];
                    return generateNums();
                }

            }
        }
        if(checkArr.length == startCounter){
            checkAns();
        }
    }

    var checkAns = function () {
        var tempArr = [];

        for (var i = 0; i < checkArr.length; i++) {
            for (var j = i + 1; j < checkArr.length; j++) {
                var num = checkArr[i] + checkArr[j];
                tempArr.push(num);
            }
        }


       for (var i = 0; i < tempArr.length; i++) {
            if (tempArr[i] !== sums[i]) {
                count++;
                checkArr = [];
                return generateNums(); 
            }
        } 
    }
    generateNums();
    console.log(Number(checkArr.join("")));
    return Number(checkArr.join(""))

}

number([10, 9, 7, 11, 9, 7, 11, 6, 10, 8]);