# ng-fi-text 0.1.0

### Makes any text fits any box of any size in any ( angular ) website.

---------

Note: This fork implements functionality forcing the html to fit on a single line.

####[You can see THE DEMO HERE][1]

[1]:http://leandropio.github.io/ng-fi-text/

## Installation

Important: This plugin requires angular version 1.3 or greater

#### Install by command line with bower
Go to your project's root directory and type:
 ```bash
 bower install ng-fi-text
 ```

#### Alternative installation
 Download the file from the "dist" folder of this repo, which has the newest version available, and then copy it to your project's folder.


#### Adding it to angular
Load the module in your application by adding it as a dependent module:
```javascript
angular.module('app', ['ng-fi-text']);
```



## Usage

### Requeriments for making it work properly
_ng-fi-text_ can be initialized in multiple divs inside a page. It only needs to be inside de app's scope.

It is very important to ensure the container div you will apply _ng-fi-text_ have the css position set to **relative** or **absolute**, otherwise the plugin will place the fitting text in weird locations.



### In case you want to bind normal text (non html)
To make it work add the _ng-fi-text_ attribute to a div:
```html
<div ng-fi-text="{{ angular.model }}"></div>
```

### In case you want to bind html markup inside fi-text
Add the _ng-fi-text_ attribute without any value and also add the _ng-fi-text_ attribute with the current value assigned:
```html
<div ng-fi-text ng-fi-text-html="{{ angular.model }}"></div>
```


### Final result rotation 
If you want to add a rotation to the resulting div, add the ng-fi-text-rotate with a positive value for a clockwise movement and a negative one for the contrary one.
```html
<div ng-fi-text="'This text will be upside down'" ng-fi-text-rotate="180"></div>
```

## Author
Leandro Bessone

## License
MIT
