declare interface SimpliPlacement {
    defaultPlacementHeight: number,
    defaultPlacementWidth: number,
    renderedInTopWindow: boolean,
    iframe: HTMLIFrameElement,
    pivot: HTMLScriptElement,
    wrapper: HTMLDivElement
}

declare enum SimpliTagListener {
    onStandardEventTracked = 'onStandardEventTracked',
    onCustomEventTracked = 'onCustomEventTracked',
    onClickEventTracked = 'onClickEventTracked',
    onVideoEventTracked = 'onVideoEventTracked'
}

declare enum SimpliTagListenerEventLabel {
    iabImpressionViewed ='iab impression viewed',
    creativeExposeTime = 'creative exposure time',
    creativeEngagement = 'creative engagement',
    creativeRendered = 'creative rendered',
    mainCreativeViewed ='main creative viewed',
    creativeRequested = 'creative requested',
    creativeLoaded = 'creative loaded',
    creativeDismissed = 'creative dismissed',
    creativeExposureTime = 'creative exposure time',
    impressionViewed = 'impression viewed',
}

declare type SimpliTagListenerEvent = {
    assetName: string | null
    eventName: SimpliTagListener
    label: SimpliTagListenerEventLabel
    type: 'standard' | 'custom'
    who: 'auto'
}

declare interface SimpliRuntime {
    environment: {
        tagWindow: Window;
        tagScript: HTMLScriptElement;
        adsOnPage?: HTMLElement;
        canAccessTopWindow: boolean;
        is: string;
        isAPN: boolean;
        isDesktop: boolean;
        isFloating: boolean;
        isFriendlyIframe: boolean;
        isIABFriendlyIframe: boolean;
        isInline: boolean;
        isMobile: boolean;
        isMobileOptimized: boolean;
        isPhone: boolean;
        isPreview: boolean;
        isTable: boolean;
        legacyRender: boolean;
        outerWrapper: HTMLDivElement;
        placementViewportHeight: number;
        placementViewportWidth: number;
        tagOuterElement: HTMLScriptElement;
        tagWrapper: HTMLDivElement;
        topAccessibleWindow: Window;
    }
}

declare interface SimpliTag {
    /**
     * Get the tag placement
     */
    vplacement: () => SimpliPlacement,
    /**
     * Get the runtime environment options
     */
    runtime: () => SimpliRuntime,
    /**
     * Object used to add listener to the SimpliTag
     */
    listeners: {
        add: (name: SimpliTagListener, callback: (event : SimpliTagListenerEvent) => void ) => void
    }
}
