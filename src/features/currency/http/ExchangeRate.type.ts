export type ExchangeRateResponse = {
    result: "success" | "error"
    documentation: string
    terms_of_use: string
}

export type ExChangeRateCodesResponse = {
    supported_codes: (string[])[]
} & ExchangeRateResponse

export type ExchangeRateLatestResponse = {
    time_last_update_unix: string
    time_last_update_utc: string
    time_next_update_unix: string
    time_next_update_utc: string
    base_code: string
    conversion_rates: Object
} & ExchangeRateResponse