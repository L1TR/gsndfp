###!
#  Project: gsnevent triggering
 * ===============================
###

### Usage:
#   For Publisher:
#         Gsn.Advertising.clickBrickOffer(clickTrackingUrl, 69);
#
#   For Consumer:
#         Gsn.Advertising.on('clickBrickOffer', function(evt)) { alert(evt.OfferCode); });
#
# The following events are currently available: clickProduct, clickPromotion, clickBrand, clickBrickOffer, clickRecipe, and clickLink
###

# the semi-colon before function invocation is a safety net against concatenated
# scripts and/or other plugins which may not be closed properly.
((win) ->
  defaults = require('defaults')
  trakless2 = require('trakless')
  gsndfpfactory = require('./gsndfpfactory.coffee')
  doc = win.document
  gsnContext = win.gsnContext
  trakless = win.trakless
  tickerFrame = undefined
  myGsn = win.Gsn or {}
  oldGsnAdvertising = myGsn.Advertising
  gsnSw2 = new gsndfpfactory()
  gsnDfp = new gsndfpfactory()
  circPlus = new gsndfpfactory()
  if typeof oldGsnAdvertising != 'undefined'
    # prevent multiple load
    if oldGsnAdvertising.pluginLoaded
      return

  createFrame = ->
    if typeof tickerFrame == 'undefined'
      # create the IFrame and assign a reference to the
      # object to our global variable tickerFrame.
      tempIFrame = doc.createElement('iframe')
      tempIFrame.setAttribute 'id', 'gsnticker'
      tempIFrame.style.position = 'absolute'
      tempIFrame.style.top = '-9999em'
      tempIFrame.style.left = '-9999em'
      tempIFrame.style.zIndex = '99'
      tempIFrame.style.border = '0px'
      tempIFrame.style.width = '0px'
      tempIFrame.style.height = '0px'
      tickerFrame = doc.body.appendChild(tempIFrame)
      if doc.frames
        # this is for IE5 Mac, because it will only
        # allow access to the doc object
        # of the IFrame if we access it through
        # the doc.frames array
        tickerFrame = doc.frames['gsnticker']
    return

  class Plugin
    pluginLoaded: true
    defaultActionParam:
      # default action parameters *optional* means it will not break but we would want it if possible
       # required - example: registration, coupon, circular
      page: undefined
       # required - specific action/event/behavior name (prev circular, next circular)
      evtname: ''
       # optional* - string identifying the department
      dept: undefined
      # -- Device Data --
       # optional* - kios, terminal, or device Id
       # if deviceid is not unique, then the combination of storeid and deviceid should be unique
      deviceid: ''
       # optional* - the storeId
      storeid: ''
       # these are consumer data
       # optional* - the id you use to uniquely identify your consumer
      consumerid: ''
       # optional* - determine if consumer is anonymous or registered with your site
      isanon: false
       # optional * - string identify consumer loyalty card id
      loyaltyid: ''
      # -- Consumer Interest --
      aisle: ''           # optional - ailse
      category: ''        # optional - category
      shelf: ''           # optional - shelf
      brand: ''           # optional - default brand
      pcode: ''           # string contain product code or upc
      pdesc: ''           # string containing product description
      latlng: [0,0]       # latitude, longitude if possible
       # optional - describe how you want to categorize this event/action.
       # ie. this action is part of (checkout process, circular, coupon, etc...)
      evtcategory: ''
       # example: page (order summary), evtcategory (checkout), evtname (transaction total), evtvalue (100) for $100
      evtvalue: 0
      # additional parameters TBD
    translator:
      siteid: 'sid'
      page: 'pg'
      evtname: 'en'
      dept: 'dpt'
      deviceid: 'dvc'
      storeid: 'str'
      consumerid: 'cust'
      isanon: 'isa'
      loyaltyid: 'loy'
      aisle: 'asl'
      category: 'cat'
      shelf: 'shf'
      brand: 'brd'
      pcode: 'pcd'
      pdesc: 'pds'
      latlng: 'latlng'
      evtcategory: 'ec'
      evtvalue: 'ev'
    isDebug: false
    gsnid: 0
    selector: 'body'
    apiUrl: 'https://clientapi.gsn2.com/api/v1'
    gsnNetworkId: undefined
    gsnNetworkStore: undefined
    onAllEvents: undefined
    oldGsnAdvertising: oldGsnAdvertising
    minSecondBetweenRefresh: 5
    enableCircPlus: false
    disableSw: ''
    source: ''
    targetting: {}
    depts: []
    circPlusBody: undefined
    refreshExisting:
      circPlus: false
      pods: false
    circPlusDept: undefined
    timer: undefined

    ###*
    # get network id
    #
    # @return {Object}
    ###
    getNetworkId: ->
      self = @
      return self.gsnNetworkId + if (self.source or "").length > 0 then ".#{self.source}" else "" 

    ###*
    # trigger a gsnevent
    #
    # @param {String} en - event name
    # @param {Object} ed - event data
    # @return {Object}
    ###
    trigger: (en, ed) ->
      if en.indexOf('gsnevent') < 0
        en = 'gsnevent:' + en

      # a little timeout to make sure click tracking stick
      win.setTimeout (->
        trakless.util.trigger en,
            type: en
            detail: ed

        if typeof @onAllEvents == 'function'
          @onAllEvents
            type: en
            detail: ed
        return
      ), 100
      @

    ###*
    # listen to a gsnevent
    #
    # @param {String} en - event name
    # @param {Function} cb - callback
    # @return {Object}
    ###
    on: (en, cb) ->
      if en.indexOf('gsnevent') < 0
        en = 'gsnevent:' + en

      trakless.util.on en, cb
      @

    ###*
    # detach from event
    #
    # @param {String} en - event name
    # @param {Function} cb - cb
    # @return {Object}
    ###
    off: (en, cb) ->
      if en.indexOf('gsnevent') < 0
        en = 'gsnevent:' + en

      trakless.util.off en, cb
      @

    log: (message) ->
      self = myGsn.Advertising

      if (self.isDebug and console)
        console.log message
      @

    ###*
    # trigger action tracking
    #
    # @param {String} actionParam
    # @return {Object}
    ###
    trackAction: (actionParam) ->
      self = myGsn.Advertising
      translatedParam = {}
      if actionParam?
        for v, k in actionParam
          translatedParam[self.translator[k]] = v

        traker = trakless.getDefaultTracker()
        traker.track('gsn', translatedParam)

      self.log trakless.util.stringToJSON(actionParam)

      @

    ###*
    # utility method to normalize category
    #
    # @param {String} keyword
    # @return {String}
    ###
    cleanKeyword: (keyword) ->
      result = keyword.replace(/[^a-zA-Z0-9]+/gi, '_').replace(/^[_]+/gi, '')
      if result.toLowerCase?
        result = result.toLowerCase()

      return result

    ###*
    # add a dept
    #
    # @param {String} dept
    # @return {Object}
    ###
    addDept: (dept) ->
      self =  myGsn.Advertising
      if dept?
        oldDepts = self.depts
        depts = []
        goodDepts = {}
        depts.push self.cleanKeyword dept
        goodDepts[depts[0]] = 1
        self.circPlusDept = depts[0]
        for dept in oldDepts
          if !goodDepts[dept]?
            depts.push dept
          goodDepts[dept] = 1

        while depts.length > 5
          depts.pop()

        self.depts = depts
      @

    ###*
    # fire a tracking url
    #
    # @param {String} url
    # @return {Object}
    ###
    ajaxFireUrl: (url) ->
      #/ <summary>Hit a URL.  Good for click and impression tracking</summary>
      if typeof url == 'string'
        if url.length < 10
          return

        # this is to cover the cache buster situation
        url = url.replace('%%CACHEBUSTER%%', (new Date).getTime())
        createFrame()
        tickerFrame.src = url
      @

    ###*
    # Trigger when a product is clicked.  AKA: clickThru
    #
    ###
    clickProduct: (click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) ->
      @ajaxFireUrl click
      @trigger 'clickProduct',
        myPlugin: this
        CategoryId: categoryId
        BrandName: brandName
        Description: productDescription
        ProductCode: productCode
        DisplaySize: displaySize
        RegularPrice: regularPrice
        CurrentPrice: currentPrice
        SavingsAmount: savingsAmount
        SavingsStatement: savingsStatement
        AdCode: adCode
        CreativeId: creativeId
        Quantity: quantity or 1
      @

    ###*
    # Trigger when a brick offer is clicked.  AKA: brickRedirect
    #
    ###
    clickBrickOffer: (click, offerCode, checkCode) ->
      @ajaxFireUrl click
      @trigger 'clickBrickOffer',
        myPlugin: this
        OfferCode: offerCode or 0
      @

    ###*
    # Trigger when a brand offer or shopper welcome is clicked.
    #
    ###
    clickBrand: (click, brandName) ->
      @ajaxFireUrl click
      @setBrand brandName
      @trigger 'clickBrand',
        myPlugin: this
        BrandName: brandName
      @

    ###*
    # Trigger when a promotion is clicked.  AKA: promotionRedirect
    #
    ###
    clickPromotion: (click, adCode) ->
      @ajaxFireUrl click
      @trigger 'clickPromotion',
        myPlugin: this
        AdCode: adCode
      @

    ###*
    # Trigger when a recipe is clicked.  AKA: recipeRedirect
    #
    ###
    clickRecipe: (click, recipeId) ->
      @ajaxFireUrl click
      @trigger 'clickRecipe', RecipeId: recipeId
      @

    ###*
    # Trigger when a generic link is clicked.  AKA: verifyClickThru
    #
    ###
    clickLink: (click, url, target) ->
      if target == undefined or target == ''
        target = '_top'
      @ajaxFireUrl click
      @trigger 'clickLink',
        myPlugin: this
        Url: url
        Target: target
      @

    ###*
    # set the brand for the session
    #
    ###
    setBrand: (brandName) ->
      trakless.util.session('gsndfp:brand', brandName)
      @

    ###*
    # get the brand currently in session
    #
    ###
    getBrand: ->
      trakless.util.session('gsndfp:brand')

    ###*
    # handle a dom event
    #
    ###
    actionHandler: (evt) ->
      self = myGsn.Advertising
      elem = if evt.target then evt.target else evt.srcElement
      payLoad = {}
      if elem?
        allData = trakless.util.allData(elem)
        for k, v in allData when /^gsn/gi.test(k)
          realk = /^gsn/i.replace(k, '').toLowerCase()
          payLoad[realk] = v
      
      self.refresh payLoad
      return self

    ###*
    # internal method for refreshing adpods
    #
    ###
    refreshAdPodsInternal: (actionParam, forceRefresh) ->
      self = myGsn.Advertising
      payLoad = defaults actionParam, self.defaultActionParam

      # track payLoad
      payLoad.siteid = self.gsnid
      self.trackAction payLoad
      canRefresh = lastRefreshTime <= 0 || ( (new Date).getTime() / 1000 - lastRefreshTime) >= self.minSecondBetweenRefresh

      if (forceRefresh || canRefresh)
        lastRefreshTime = (new Date()).getTime() / 1000;
        self.addDept payLoad.dept
        if (forceRefresh)
          self.refreshExisting.pods = false
          self.refreshExisting.circPlus = false

        targetting =
          dept: self.depts or []
          brand: self.getBrand()

        if payLoad.page
          targetting.kw = payLoad.page.replace(/[^a-z]/gi, '');

        gsnDfp.init(self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore or ''),
          setTargeting: targetting
          refreshExisting: self.refreshExisting.pods
        )
        self.refreshExisting.pods = true

        if self.enableCircPlus
          targetting.dept = [self.circPlusDept || 'produce']
          circPlus.init(self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore or ''),
            setTargeting: targetting
            circPlusBody: self.circPlusBody
            dfpSelector: '.circplus'
            refreshExisting: self.refreshExisting.circPlus
          )
          self.refreshExisting.circPlus = true


      @

    ###*
    # adpods refresh
    #
    ###
    refresh: (actionParam, forceRefresh) ->
      self = myGsn.Advertising
      if (!self.hasGsnUnit()) then return self

      if (self.gsnid)
        gsnSw2.init(self.gsnid, 
          displayWhenExists: '.gsnadunit,.gsnunit'
          dfpSelector: '.gsnsw'
          onData: (evt) ->
            if (self.source or '').length > 0
              evt.cancel = self.disableSw.indexOf(self.source) > 0

          onClose: ->
            # make sure selector is always wired-up
            if self.selector?
              trakless.util.onClick self.selector, self.actionHandler, '.gsnaction'
              self.selector  = null

            self.refreshAdPodsInternal(actionParam, forceRefresh)
        )

      @

    ###*
    # determine if there are adpods on the page
    #
    ###
    hasGsnUnit: () ->
      return trakless.util.$('.gsnadunit,.gsnunit,.circplus').length > 0

    ###*
    # set global defaults
    #
    ###
    setDefault: (defaultParam) ->
      self = myGsn.Advertising
      self.defaultActionParam = defaults defaultParam, self.defaultActionParam
      @

    ###*
    # method for support refreshing with timer
    #
    ###
    refreshWithTimer: (actionParam) ->
      self = myGsn.Advertising
      if (!actionParam?)
        actionParam = { evtname: 'refresh-timer' }

      self.refresh(actionParam, true)
      timer = (self.timer || 0) * 1000

      if (timer > 0)
        setTimeout self.refreshWithTimer, timer

      @

    ###*
    # the onload method, document ready friendly
    #
    ###
    load: (gsnid, isDebug) ->
      self = myGsn.Advertising
      if (gsnid)
        self.gsnid = gsnid
        self.isDebug = isDebug unless self.isDebug

      return self.refreshWithTimer({ evtname: 'loading' })

  # create the plugin and map function for backward compatibility with Virtual Store
  myPlugin = new Plugin
  myGsn.Advertising = myPlugin
  myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer
  myGsn.Advertising.clickBrand = myPlugin.clickBrand
  myGsn.Advertising.clickThru = myPlugin.clickProduct
  myGsn.Advertising.refreshAdPods = myPlugin.refresh

  myGsn.Advertising.logAdImpression = ->
  # empty function, does nothing

  myGsn.Advertising.logAdRequest = ->
  # empty function, does nothing

  myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion
  myGsn.Advertising.verifyClickThru = myPlugin.clickLink
  myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe

  # put GSN back online
  win.Gsn = myGsn

  buildQueryString = (keyWord, keyValue) ->
    if keyValue != null
      keyValue = new String(keyValue)
      if keyWord != 'ProductDescription'
        # some product descriptions have '&amp;' which should not be replaced with '`'.
        keyValue = keyValue.replace(/&/, '`')
      keyWord + '=' + keyValue.toString()
    else
      ''

  if (gsnContext?)
    myGsn.Advertising.on 'clickRecipe', (data) ->
      if data.type != 'gsnevent:clickRecipe'
        return
      win.location.replace '/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId
      return

    myGsn.Advertising.on 'clickProduct', (data) ->
      if data.type != 'gsnevent:clickProduct'
        return

      product = data.detail
      if product
        queryString = new String('')
        queryString += buildQueryString('DepartmentID', product.CategoryId)
        queryString += '~'
        queryString += buildQueryString('BrandName', product.BrandName)
        queryString += '~'
        queryString += buildQueryString('ProductDescription', product.Description)
        queryString += '~'
        queryString += buildQueryString('ProductCode', product.ProductCode)
        queryString += '~'
        queryString += buildQueryString('DisplaySize', product.DisplaySize)
        queryString += '~'
        queryString += buildQueryString('RegularPrice', product.RegularPrice)
        queryString += '~'
        queryString += buildQueryString('CurrentPrice', product.CurrentPrice)
        queryString += '~'
        queryString += buildQueryString('SavingsAmount', product.SavingsAmount)
        queryString += '~'
        queryString += buildQueryString('SavingsStatement', product.SavingsStatement)
        queryString += '~'
        queryString += buildQueryString('Quantity', product.Quantity)
        queryString += '~'
        queryString += buildQueryString('AdCode', product.AdCode)
        queryString += '~'
        queryString += buildQueryString('CreativeID', product.CreativeId)
        # assume there is this global function
        if typeof AddAdToShoppingList == 'function'
          AddAdToShoppingList queryString
      return

    myGsn.Advertising.on 'clickLink', (data) ->
      if data.type != 'gsnevent:clickLink'
        return
        
      linkData = data.detail
      if linkData
        if linkData.Target == undefined or linkData.Target == ''
          linkData.Target = '_top'
        if linkData.Target == '_blank'
          # this is a link out to open in new window
          win.open linkData.Url
        else
          # assume this is an internal redirect
          win.location.replace linkData.Url
      return

    myGsn.Advertising.on 'clickPromotion', (data) ->
      if data.type != 'gsnevent:clickPromotion'
        return

      linkData = data.detail
      if linkData
        win.location.replace '/Ads/Promotion.aspx?adcode=' + linkData.AdCode
      return

    myGsn.Advertising.on 'clickBrickOffer', (data) ->
      if data.type != 'gsnevent:clickBrickOffer'
        return

      linkData = data.detail
      if linkData
        url = myGsn.Advertising.apiUrl + '/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode
        # open brick offer using the new api URL
        win.open url, ''
      return
      
  #auto init with attributes
  # at this point, we expect Gsn.Advertising to be available from above

  aPlugin = myGsn.Advertising
  if !aPlugin then return

  attrs =
    debug: (value) ->
      return unless typeof value is "string"
      aPlugin.isDebug = value isnt "false"
    api: (value) ->
      return unless typeof value is "string"
      aPlugin.apiUrl = value
    source: (value) ->
      return unless typeof value is "string"
      aPlugin.source = value
    gsnid: (value) ->
      return unless value
      aPlugin.gsnid = value
      trakless.setSiteId(value)
    timer: (value) ->
      return unless value
      aPlugin.timer = value
    selector: (value) ->
      return unless typeof value is "string"
      aPlugin.selector = value

  for script in doc.getElementsByTagName("script")
    if /gsndfp/i.test(script.src)
      for prefix in ['','data-']
        for k,fn of attrs
          fn script.getAttribute prefix+k


  trakless.setPixel('//pi.gsngrocers.com/pi.gif')

  if aPlugin.hasGsnUnit() 
   aPlugin.load() 
  else 
    trakless.util.ready( -> 
      aPlugin.load()
    )

  return
  module.exports = myGsn

) window

