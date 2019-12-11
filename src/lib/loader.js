import $ from 'jquery';
import 'gasparesganga-jquery-loading-overlay';

const opts = {background: 'rgba(165, 190, 100, 0'};

const loading = (el, action, fullPageLoading) => {
    if (true === fullPageLoading) {
        $.LoadingOverlay(action, opts);

        return;
    }
    $(el).LoadingOverlay(action, opts);
}

export {loading};