var app = angular.module('typingApp', []);

app.controller('TypingController', function($scope, $interval) {
    $scope.sentences = [
        "This typing test is rather basic and it perturbs me.",
        "AngularJS is rather outdated so I should've used Angular instead.",
        "Typing speed is a weird thing to measure after a certain baseline.",
        "It behooves me to complete the entirety of this typing test.",
        "This is a short sentence."
    ];
    $scope.numberRange = Array.from({ length: $scope.sentences.length }, (v, k) => k + 1);
    $scope.selectedNumber = 1;

    function getRandomSentences(count) {
        let tempSentences = [...$scope.sentences];
        let selectedSentences = [];
        
        for (let i = 0; i < count && tempSentences.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * tempSentences.length);
            selectedSentences.push(tempSentences[randomIndex]);
            tempSentences.splice(randomIndex, 1);
        }
        
        return selectedSentences.join(' ').split('');
    }

    $scope.resetTest = function() {
        if (timer) {
            $interval.cancel(timer);
        }
        $scope.userInput = "";
        $scope.startTime = null;
        $scope.completed = false;
        $scope.timeElapsed = 0;
        $scope.wpm = 0;
        $scope.accuracy = 0;
        $scope.showTest = false;
        
    };

    $scope.resetTest();
    var timer;

    $scope.startTest = function() {
        $scope.sentence = getRandomSentences($scope.selectedNumber);
        $scope.showTest = true;
        $scope.selectedNumber = 1;
    };

    $scope.checkTyping = function() {
        if ($scope.userInput.length === 1 && !$scope.startTime) {
            $scope.startTime = new Date();
            timer = $interval(function() {
                $scope.timeElapsed = Math.floor((new Date() - $scope.startTime) / 1000);
            }, 1000);
        }


        if ($scope.userInput.length >= $scope.sentence.length) {
            calculateResults();
        }
    };

    $scope.isCorrect = function(index) {
        return $scope.userInput[index] === $scope.sentence[index];
    };

    $scope.isWrong = function(index) {
        return $scope.userInput[index] && $scope.userInput[index] !== $scope.sentence[index];
    };

    function calculateResults() {
        var correctChars = 0;
        for (var i = 0; i < $scope.sentence.length; i++) {
            if ($scope.userInput[i] === $scope.sentence[i]) {
                correctChars++;
            }
        }

        var timeTaken = (new Date() - $scope.startTime) / 1000 / 60; 
        if (timer) {
            $interval.cancel(timer);
        }
        var wordCount = $scope.sentence.length / 5; // Average word length = 5
        $scope.wpm = Math.round(wordCount / timeTaken);
        $scope.accuracy = Math.round((correctChars / $scope.sentence.length) * 100);
        $scope.completed = true;
    }
});
