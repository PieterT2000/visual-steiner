#ifndef FPUTILS_WASM_CODE_H
#define FPUTILS_WASM_CODE_H

#include "fputils_wasm.h"

#include "fatal.h"
#include <fenv.h>
#include "gsttypes.h"
#include "logic.h"
#include <string.h>

/*
 * Global Routines
 */

void _gst_restore_floating_point_configuration(struct fpsave *sp);
void _gst_save_floating_point_configuration(struct fpsave *sp);
void _gst_set_floating_point_configuration(struct fpsave *sp);

/*
 * External References
 */

/* none */
#if NOT defined(__EMSCRIPTEN__)
#error "Unsupported platform!"
#endif

/*
 * Save the floating-point modes.
 */

void _gst_save_floating_point_configuration(

    struct fpsave *sp /* IN - buffer to save FPU state into */
)
{
    fegetenv(&(sp->fpu_state));
}

/*
 * Save off the caller's FPU modes, and force the modes that we
 * want to use within Geosteiner.
 */

void _gst_set_floating_point_configuration(

    struct fpsave *sp /* IN - buffer to save FPU state into */
)
{
    /* Stub, Webassembly does not support a floating point environment due to portability concerns */
}

void _gst_restore_floating_point_configuration(

    struct fpsave *sp /* IN - buffer to restore FPU state from */
)
{
    fesetenv(&(sp->fpu_state));
}

/*
 * Note: GeoSteiner does not use "long double" arithmetic, but the
 * LP solver might.
 *
 * The ARM64 architecture does not provide any hardware instructions
 * for IEEE 754 "extendeded precision."  When you do use "long double",
 * what you actually get is 128-bit floating-point, implemented in
 * software.  We avoid using "long double" on this platform.
 */

int _gst_enable_long_double_precision()

{
    return (0);
}

void _get_restore_long_double_precision(

    int prevState)
{
}

#endif
