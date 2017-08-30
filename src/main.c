#include "mgos.h"
#include "mgos_rpc.h"
#include "mgos_pwm.h"


void rpc_hello_world_handler(struct mg_rpc_request_info *ri, void *cb_arg,
                             struct mg_rpc_frame_info *fi,
                             struct mg_str args) {
    int new_value = 0;
    bool res = json_scanf(args.p, (int) args.len, ri->args_fmt, &new_value) <= 0;
    if (res) {
        mg_rpc_send_errorf(ri, -1, "invalid json: %.*s", args.len, args.p);
        return;
    }
    if (new_value < 0 || new_value > 20) {
        mg_rpc_send_errorf(ri, -2, "invalid new_value: %d. Must be between [0-20]", new_value);
        return;
    }
    const int LED_PIN = 2;
    const int FREQ = 1E3;

    if (!mgos_pwm_set(LED_PIN, FREQ, (100 - (new_value * 5)))) {
        mg_rpc_send_errorf(ri, -3, "error setting led's pwm");
        return;
    }

    mg_rpc_send_responsef(ri, "{msg: %d}", new_value);
    (void) cb_arg;
    (void) fi;
    (void) args;
}

enum mgos_app_init_result mgos_app_init(void) {
    struct mg_rpc *mg_rpc = mgos_rpc_get_global();
    mg_rpc_add_handler(mg_rpc, "LED.ChangeValue", "{new_value: %d}", rpc_hello_world_handler, NULL);
    return MGOS_APP_INIT_SUCCESS;
}
