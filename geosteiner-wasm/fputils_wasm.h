#ifndef FPUTILS_WASM_H
#define FPUTILS_WASM_H

#include <fenv.h>

/*
 * The following structure is used to save floating point information
 * on the WASM virtual machine.
 * Throughout most of GeoSteiner, this is just uninterpreted black-box
 * data, but we need the CPU-specific details here.
 */

struct fpsave
{
    fenv_t fpu_state;
};

#endif