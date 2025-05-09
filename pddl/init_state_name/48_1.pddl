(define (problem scene1)
  (:domain manip)
  (:objects
    large red triangular prism - item
    yellow cylinder_1 - item
    yellow cylinder_2 - item
    yellow half cylinder - item
    small blue cube - support
    blue half cylinder_1 - item
    blue half cylinder_2 - item
    large green triangular prism_1 - item
    large green triangular prism_2 - item
    small green triangular prism - item
  )
  (:init
    (ontable large red triangular prism)
    (ontable yellow cylinder_1)
    (ontable yellow half cylinder)
    (ontable small blue cube)
    (ontable blue half cylinder_1)
    (ontable blue half cylinder_2)
    (ontable large green triangular prism_1)
    (ontable large green triangular prism_2)
    (ontable small green triangular prism)
    (on yellow cylinder_2 yellow cylinder_1)
    (clear large red triangular prism)
    (clear yellow half cylinder)
    (clear small blue cube)
    (clear blue half cylinder_1)
    (clear blue half cylinder_2)
    (clear large green triangular prism_1)
    (clear large green triangular prism_2)
    (clear small green triangular prism)
    (clear yellow cylinder_2)
    (handempty)
  )
  (:goal (and))
)