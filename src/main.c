#include "mgos.h"
#include "mgos_pwm.h"
#include "mgos_rpc.h"

void rpc_hello_world_handler(struct mg_rpc_request_info *ri, void *cb_arg,
                             struct mg_rpc_frame_info *fi, struct mg_str args) {
  int r = 0;
  int g = 0;
  int b = 0;
  bool res = json_scanf(args.p, (int)args.len, ri->args_fmt, &r, &g, &b) <= 0;
  if (res) {
    mg_rpc_send_errorf(ri, -1, "invalid json: %.*s", args.len, args.p);
    return;
  }
  if (r < 0 || r > 255) {
    mg_rpc_send_errorf(ri, -2, "invalid r: %d. Must be between [0-255]", r);
    return;
  }
  if (g < 0 || g > 255) {
    mg_rpc_send_errorf(ri, -2, "invalid g: %d. Must be between [0-255]", g);
    return;
  }
  if (b < 0 || b > 255) {
    mg_rpc_send_errorf(ri, -2, "invalid b: %d. Must be between [0-255]", b);
    return;
  }
  const int D1 = 5;
  const int D2 = 4;
  const int D3 = 0;
  const int FREQ = 1E3;

  if (!mgos_pwm_set(D1, FREQ, (((float)r) / 255.0f))) {
    mg_rpc_send_errorf(ri, -3, "error setting led's pwm");
    return;
  }
  if (!mgos_pwm_set(D2, FREQ, (((float)g) / 255.0f))) {
    mg_rpc_send_errorf(ri, -3, "error setting led's pwm");
    return;
  }
  if (!mgos_pwm_set(D3, FREQ, (((float)b) / 255.0f))) {
    mg_rpc_send_errorf(ri, -3, "error setting led's pwm");
    return;
  }
  mg_rpc_send_responsef(ri, "{msg: {r: %d, g: %d, b: %d}}", r, g, b);
  (void)cb_arg;
  (void)fi;
  (void)args;
}

enum mgos_app_init_result mgos_app_init(void) {
  struct mg_rpc *mg_rpc = mgos_rpc_get_global();
  mg_rpc_add_handler(mg_rpc, "LED.ChangeValue", "{r: %d, g: %d, b: %d}",
                     rpc_hello_world_handler, NULL);
  return MGOS_APP_INIT_SUCCESS;
}
