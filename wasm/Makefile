CC = emcc
SRC = steiner.c
GST_DIR = /Users/piet/Documents/dissertation/existing/geosteiner-wasm
LP_SOLVE_DIR = $(GST_DIR)/lp_solve_2.3
OPT_FLAGS = -O3
CFLAGS = -Wall $(OPT_FLAGS)
INCLUDES = -I$(GST_DIR)
LIBS = -L$(GST_DIR) -lgeosteiner $(LP_SOLVE_DIR)/libLPS.a -lm
EMFLAGS = -s WASM=1 -s ENVIRONMENT=web \
 -s EXPORTED_FUNCTIONS="['_calc_esmt', '_calc_rsmt', '_main', '_malloc', '_free']" \
 -s EXPORTED_RUNTIME_METHODS="['cwrap', 'getValue', 'setValue']"

TARGET = steiner

all: $(TARGET)

steiner: $(SRC)
	$(CC) $(CFLAGS) $(INCLUDES) -o $(TARGET).js $< $(LIBS) $(EMFLAGS)
	cp $(TARGET).{js,wasm} ../public/

clean:
	find . -type f -name '$(TARGET).*' ! -name '$(TARGET).c' -exec rm -f {} +

# emcc -O3  -Ilp_solve_2.3  -Wall  -o demo1.html demo1.c memory.o -L./ -lgeosteiner lp_solve_2.3/libLPS.a  -lm -s WASM=1
