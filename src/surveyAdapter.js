/**
 * There are users that receive a preview link with the creative so they can see the placement
 * then do the test and must return back to the survey to continue with the marketing questions.
 *
 * The purpose of this plugin script is to render a button below the creative to let those users
 * that comes from a survey return back and continue with they survey.
 */
import { PSToolKit } from './PSToolKit.js';
import { PSDom } from './PSDom.js';

((w) => {
  /**
   * Initialize the SurveyAdapter script.
   *
   * @param {SimpliTag} SimpliTag The SimpliTag main object.
   */
  const SurveyAdapter = function (SimpliTag) {
    this.$config = {
      params: {},
      url: '',
    };

    /**
     * This method takes a query string param from the window.top
     * and use its value as future placeholder.
     *
     * @param {string} originalKeyName The name of the quey string param in the current window.top
     * @param {string} targetKeyName The placeholder key name to hold the value.
     * @returns {SurveyAdapter}
     */
    this.take = function (originalKeyName, targetKeyName = '') {
      if (!targetKeyName) {
        targetKeyName = originalKeyName;
      }

      this.$config.params[originalKeyName] = targetKeyName;

      return this;
    };

    /**
     * Get the parameters taken from Query String
     * that will be used in the final URL.
     *
     * @returns {Object<string, string>}
     */
    this.getParamsToUse = () =>
      PSToolKit.queryString.only(Object.keys(this.$config.params));

    /**
     * Get the parameters to be set in the URL.
     *
     * @returns {Object<string, string>}
     */
    this.getParamsToBeSet = () =>
      PSToolKit.placeholder.transform(
        this.$config.params,
        this.getParamsToUse(),
      );

    /**
     * Return the Final URL that will be opened.
     * @returns {string}
     */
    this.getUrl = () =>
      PSToolKit.placeholder.write(this.$config.url, this.getParamsToBeSet());

    /**
     * This method register a handler to open a new (_blank) window with the given URL
     *
     * NOTE:
     * Please note the given URL could have placeholders in the form of {keyName}
     * that could be used by the plugin and replaced with its final values at the end.
     *
     * @param {string} targetUrl The URL where to target when user click on the handler button.
     * @returns {SurveyAdapter}
     */
    this.url = function (targetUrl) {
      this.$config.url = targetUrl;
      return this;
    };

    /**
     * Initialize the plugin in the browser.
     *
     * @param {string} id The ID of the script with the meta data.
     * @returns {SurveyAdapter}
     */
    this.start = function (id = '#SurveyAdapter') {
      console.log('SurveyAdapter: START');

      PSDom.when(id).then((tag) => {
        console.log('SurveyAdapter: TAG READY');
        console.log('SurveyAdapter: IS FLOATING?', PSDom.enabled(tag, 'floating'));
        // [STEP 1] Draw the button to be added
        const button = PSDom.draw(
          `
                        <button 
                            type="button"
                            style="
                                display:none;
                                width: 250px; 
                                height: 50px;
                                margin: 40px 0 40px calc(50% - 125px); 
                                background-color: #5abf59; 
                                color: white;
                                border: none;
                                border-radius: 7px;
                                font-size: 22px;
                                font-weight: bold;
                                font-family: sans-serif;
                                cursor: pointer;
                                "
                        >
                            ${tag.dataset.text ?? 'Return to Survey'}
                        </button>
                    `,
          {
            renderOnFloating(placement) {},
            renderOnGeneric(placement) {
              PSToolKit.insertAfter(
                placement.wrapper.firstChild,
                button,
              );
            },
            showOnGeneric(placement) {

              console.log('SurveyAdapter: DISPLAYED ON GENERIC');

              const airInitHolder = placement.wrapper.firstChild;

              const adBreak = placement.wrapper.closest('.adBreak');

              let unit =
                PSDom.outerHeight(airInitHolder) + PSDom.outerHeight(button);

              adBreak.style.height = `${unit}px`;

              button.style.display = 'block';
            },
            showOnFloating(placement) {

              console.log('SurveyAdapter: DISPLAYED ON FLOATING');

              button.style.position = 'fixed'
              button.style.top = '-35px'
              button.style.left = 'calc(50% - 50%)'
              button.style.boxShadow = '1px 5px 8px rgb(0 0 0 / 44%)'
              button.style.display = 'block'
            },
            show() {

              console.log('SurveyAdapter: STARTING TO SHOW')

              if (PSDom.enabled(tag, 'floating')) {
                this.showOnFloating(SimpliTag.vplacement());
              } else {
                this.showOnGeneric(SimpliTag.vplacement());
              }
            },
          },
        );



        if (!tag.dataset.target) {
          throw new TypeError(
            'SurveyAdapter you need to specify the "data-target" attribute in the script tag to use this adapter.',
          );
        }

        const path = String(tag?.dataset?.target ?? '');
        // [STEP 2] Auto register placeholders
        PSToolKit.placeholder.keys(path).forEach((key) => this.take(key));

        // [STEP 3] Auto register the target URL
        this.url(path);

        // [STEP 4] Bind required events
        button.addEventListener('click', () => {
          window.open(this.getUrl(), '_blank');
        });

        // [STEP 5] - Draw in the wrapper
        if (PSDom.enabled(tag, 'floating')) {
          button.renderOnFloating();
        } else {
          button.renderOnGeneric();
        }

        // [STEP 6] - Show when ready
        // When at first load, if the creative is not visible, add a watcher event
        // to know when the creative is visible and then show the button.
        if (!(SimpliTag.runtime().creative.mainCreativeViewed ?? false)) {

          console.log('SurveyAdapter: mainCreativeViewed',SimpliTag?.runtime()?.creative?.mainCreativeViewed)

          SimpliTag.listeners.add('onStandardEventTracked', function (event) {
            if (event.label === 'main creative viewed') {
              button.show();
            }
          });

          return this;
        }
        console.log('SurveyAdapter: Always visible')
        // If instead the creative is already visible, show the button ASAP.
        button.show();
      });

      return this;
    };
  };

  w.onload = function () {
    /** @type {SimpliTag} */
    const simpli = w.__simpli;

    if (typeof simpli === 'undefined') {
      throw new TypeError(
        'SurveyAdapter rely on Simpli Tag script. PLease include the required script first.',
      );
    }

    if (!simpli?.runtime()?.environment?.isFriendlyIframe) {
      console.warn('SurveyAdapter is only available in friendly iframe.');
      return this;
    }

    console.log('SurveyAdapter: INIT');

    w.SurveyAdapter = new SurveyAdapter(simpli).start();
  };
})(window);
