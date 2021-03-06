import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { openSnackbar } from "./snackbar";
import { requestInquiryUpdate } from "./request_inquiry_info";

export function requestInquirySend(
    BunqJSClient,
    userId,
    accountId,
    description,
    amount,
    target,
    options = {
        status: false,
        minimum_age: false,
        allow_bunqme: false,
        redirect_url: false
    }
) {
    return dispatch => {
        dispatch(requestInquiryLoading());
        BunqJSClient.api.requestInquiry
            .post(userId, accountId, description, amount, target, options)
            .then(result => {
                dispatch(openSnackbar("Request was sent successfully!"));
                dispatch(requestInquiryNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiryNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while sending your request inquiry"
                );
            });
    };
}

export function requestInquiryCancel(
    BunqJSClient,
    userId,
    accountId,
    requestInquiryId
) {
    return dispatch => {
        dispatch(requestInquiryLoading());
        BunqJSClient.api.requestInquiry
            .put(userId, accountId, requestInquiryId, "REVOKED")
            .then(result => {
                dispatch(
                    openSnackbar("Request was cancelled successfully!")
                );
                dispatch(requestInquiryNotLoading());

                // update the information page
                dispatch(
                    requestInquiryUpdate(
                        BunqJSClient,
                        userId,
                        accountId,
                        requestInquiryId
                    )
                );
            })
            .catch(error => {
                dispatch(requestInquiryNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while trying to cancel your request inquiry"
                );
            });
    };
}

export function requestInquiryLoading() {
    return { type: "REQUEST_INQUIRY_IS_LOADING" };
}

export function requestInquiryNotLoading() {
    return { type: "REQUEST_INQUIRY_IS_NOT_LOADING" };
}
