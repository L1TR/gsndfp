
#
# Task args.
#

PORT ?= 0
BROWSER ?= ie:9
TESTS = $(wildcard test/*.coffee)
SRC = $(wildcard src/*.coffee)
MINIFY = $(BINS)/uglifyjs
PID = test/server/pid.txt
BINS = node_modules/.bin
BUILD = build.js
DUO = $(BINS)/duo
DUOT = $(BINS)/duo-test -p test/server -R spec -P $(PORT) -c "make build.js"
COFFEE = bin/coffee --js --bare

#
# Default target.
#

default: build
default: gsndfp.js
#
# Clean.
#

clean:
	@rm -rf components $(BUILD)
	@rm -f gsndfp.js gsndfp.min.js
	@rm -rf node_modules npm-debug.log
#
# Test with phantomjs.
#

test: $(BUILD)
	@$(DUOT) phantomjs

#
# Test with saucelabs
#

test-sauce: $(BUILD)
	@$(DUOT) saucelabs \
		--browsers $(BROWSER) \
		--title gsndfp.js

#
# Test in the browser.
#
# On the link press `cmd + doubleclick`.
#

test-browser: $(BUILD)
	@$(DUOT) browser

#
# Phony targets.
#

.PHONY: clean
.PHONY: test
.PHONY: test-browser
.PHONY: test-coverage
.PHONY: test-sauce

#
# Target for `gsndfp.js` file.
#

gsndfp.js: node_modules $(SRC)
	@$(DUO) --use duo-coffee src/index.coffee > gsndfp.js
	@$(MINIFY) gsndfp.js --output gsndfp.min.js

#
# Target for `node_modules` folder.
#

node_modules: package.json
	@npm install
	@touch $@
	
#
# Target for build files.
#


$(BUILD): node_modules $(TESTS) src/index.coffee
	@$(DUO) --development --use duo-coffee test/tests.coffee > $(BUILD)

#
# Phony build target
#

build: $(BUILD)

.PHONY: build