#include <geosteiner.h>
#include <stdlib.h>

const int R = 2;

double *get_t_coord(int t, int n, double *terms, double *sps)
{
    if (t >= n)
    {
        return &sps[(t - n) * R];
    }
    return &terms[t * R];
}

void calc_esmt(int n, double *terms, double *length, int *nsps, double *sps, int *nedges, int *edges)
{
    if (gst_open_geosteiner() != 0)
    {
        printf("Error opening geosteiner\n");
        exit(1);
    }
    gst_esmt(n, terms, length, nsps, sps, nedges, edges, NULL, NULL);
    printf("Length: %f\n", *length);
    printf("Nsps: %d\n", *nsps);
    printf("Nedges: %d\n", *nedges);
    gst_close_geosteiner();
}

void calc_rsmt(int n, double *terms, double *length, int *nsps, double *sps, int *nedges, int *edges)
{
    if (gst_open_geosteiner() != 0)
    {
        printf("Error opening geosteiner\n");
        exit(1);
    }
    gst_rsmt(n, terms, length, nsps, sps, nedges, edges, NULL, NULL);
    gst_close_geosteiner();
}

int main()
{
    int n = 4;
    double terms[8] = {0, 0,
                       0, 1,
                       1, 0,
                       1, 1};
    int nsps, nedges;
    double length;
    double sps[R * (n - 2)];      // Max number of Steiner points is n - 2
    int edges[R * ((2 * n) - 3)]; // Max number of edges is 2n - 3

    printf("Setting up env\n");
    calc_esmt(n, terms, &length, &nsps, sps, &nedges, edges);
    // if (gst_open_geosteiner() != 0)
    // {
    //     printf("Error opening geosteiner\n");
    //     exit(1);
    // }
    // gst_esmt(n, terms, &length, &nsps, sps, &nedges, edges, NULL, NULL);

    // printf("Length: %f\n", length);
    // printf("Nsps: %d\n", nsps);
    // printf("Nedges: %d\n", nedges);
    // for (int i = 0; i < nsps; i++)
    // {
    //     printf("Steiner point %d: (%f, %f)\n", i, sps[i * R], sps[(i * R) + 1]);
    // }
    // for (int i = 0; i < nedges; i++)
    // {
    //     printf("Edge %d: %d -> %d\n", i, edges[i * R], edges[(i * R) + 1]);
    //     int t = edges[i * R];
    //     int t_next = edges[(i * R) + 1];
    //     double *t_coord = get_t_coord(t, n, terms, sps);
    //     double *t_next_coord = get_t_coord(t_next, n, terms, sps);
    //     printf("Edge %d: (%f, %f) -> (%f, %f)\n", i, t_coord[0], t_coord[1], t_next_coord[0], t_next_coord[1]);
    // }

    // gst_close_geosteiner();
    exit(0);
}