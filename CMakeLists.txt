cmake_minimum_required(VERSION 3.8)
project(esp_websocket_led)

set(MOS_VERSION latest)

include_directories(/home/andrea/.mos/modules-${MOS_VERSION}/mongoose-os-${MOS_VERSION}
        /home/andrea/.mos/modules-${MOS_VERSION}/mongoose-os-${MOS_VERSION}/fw/src
        /home/andrea/.mos/libs-${MOS_VERSION}/dht-${MOS_VERSION}/src
        /home/andrea/.mos/libs-${MOS_VERSION}/rpc-common-${MOS_VERSION}/src
        /home/andrea/.mos/libs-${MOS_VERSION}/blynk-${MOS_VERSION}/src
        /home/andrea/.mos/libs-${MOS_VERSION}/wifi-${MOS_VERSION}/src
        /home/andrea/.mos/libs-${MOS_VERSION}/pwm-${MOS_VERSION}/src
        /home/andrea/.mos/libs-${MOS_VERSION}/rpc-common-${MOS_VERSION}/src/mg_rpc)

set(CMAKE_CXX_STANDARD 11)

set(SOURCE_FILES
        src/main.c)

add_custom_target(
        esp
        mos build
)
add_executable(esp_dehumidifier ${SOURCE_FILES})