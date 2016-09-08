//By David Keegan
//InScopeApps.com
//http://inscopeapps.com/demos/flipbook/

(function($){
    $.fn.flipbook = function(options){
        options = $.extend({
            'start': 0, //start frame
            'end': 100, //end frame, must be greater then start
            'step': 1, //number of frames to step over while animating
            'mobileStep': 3, //number of frames to step over when on a mobile device
            'fps': 15, //frames per second, this will be adjusted correctly for step>1
            'loop': false, //loop the animation
            //the image path, uses %d to designate where the frame number goes. 
            //%#d can be used to specify padding
            'images': ''
        }, options);
        
        var animatingAttr = 'flipbook_animating';
        
        //if we are on a mobile webbrowser use the mobile step for better playback
        var is_mobile = (navigator.userAgent.toLowerCase().indexOf('mobile')>=0);
        
        function clamp(value, min){
            if(value < min){
                return min;
            }
            return value;
        }
        
        function padFrame(frame, padding){
            var frameString = frame+'';
            var delta = padding-frameString.length;
            for(var i=0; i<delta; ++i){
                frameString = '0'+frameString;
            }
            return frameString;
        }       
        
        return this.each(function(){
            var $image = $(this);
            
            //check if the image is already animating
            if($image.attr(animatingAttr) === 'true'){
                return;
            }
            
            //find image parts
            var images = $image.attr('images')||options.images;
            var imagesMatch = images.match(/([^%]*)%(\d?)d(.*)/);
            if(imagesMatch === null){
                console.error('"'+images+'" does not conform to images convention, it should be like "frame.%d.jpg" or "frame.%4d.jpg"');
                return;
            } 
            var imagesFrontString = imagesMatch[1];
            var framePadding = 0;
            var imagesEndString = imagesMatch[2];
            //if frame padding is specified
            if(imagesMatch.length === 4){
                framePadding = parseInt(imagesMatch[2], 10);
                imagesEndString = imagesMatch[3];
            }            
            
            //get the rest of the values from the img or the options
            var start = parseInt($image.attr('start')||options.start, 10);
            var end = parseInt($image.attr('end')||options.end, 10);
            if(start > end){
                console.error('"start" cannot be larger then "end"');
                return;
            }
            var step = $image.attr('step')||options.step;
            if(is_mobile){
                step = $image.attr('mobileStep')||options.mobileStep;
            }
            step = clamp(parseInt(step, 10), 1);
            
            var fps = clamp(parseInt($image.attr('fps')||options.fps, 10), 1);
            var loop = $image.attr('loop')||options.loop; 
            if(loop === 'true'){
                loop = true;
            }else if(loop === 'false'){
                loop = false;
            }
            
            //calculate the hold time taking into acount frame step
            var holdTime = 1000/(fps/step);
            function imageName(frame){
                return imagesFrontString+padFrame(frame, framePadding)+imagesEndString;
            }
            
            var frameNumber = start;
            $image.attr('src', imageName(frameNumber));
            $image.attr(animatingAttr, 'true');
            
            //increment frameNumber and change the image
            function flipImage(){
                //increment the frame
                frameNumber += step;
                
                //check if we've reached the end, if we have
                //and loop is true set the frame back to the start frame
                if(frameNumber > end && loop){
                    frameNumber = start;
                }
                
                //if we haven't reached the end yet update 
                //the image and start the cycle again
                if(frameNumber <= end){
                    //console.log('set: '+imageName(frameNumber));
                    $image.attr('src', imageName(frameNumber));
                    setTimeout(flipImage, holdTime);
                }else{
                    //always show the last image
                    $image.attr('src', imageName(end));
                    $image.attr(animatingAttr, 'false');
                }          
            }
            
            //preload images
            var preloadCount = start;
            //check if all the image have been preloaded,
            //if they have start the animation
            function shouldStartAnimation(){
                //console.log('pre: '+imageName(i));
                preloadCount += step;
                if(preloadCount >= end){
                    setTimeout(flipImage, holdTime);
                }      
            }
            
            //asynchronously preload all images, 
            //then start the animation
            for(var i=start; i<=end; i+=step){
                $('<img/>').attr('src', imageName(i)).load(shouldStartAnimation);
            }                   
        });
    };
})(jQuery);