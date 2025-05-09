(define (problem scene1)
  (:domain manip)
  (:objects
    large red triangular prism - item
    yellow cylinder_1 yellow cylinder_2 - item
    yellow half cylinder - item
    small blue cube - support
    blue half cylinder_1 blue half cylinder_2 - item
    large green triangular prism_1 large green triangular prism_2 - item
    small green triangular prism - item
  )
  (:init
    (ontable large red triangular prism)
    (ontable yellow cylinder_1)
    (ontable yellow cylinder_2)
    (ontable yellow half cylinder)
    (ontable small blue cube)
    (ontable blue half cylinder_1)
    (ontable blue half cylinder_2)
    (ontable large green triangular prism_1)
    (ontable large green triangular prism_2)
    (ontable small green triangular prism)
    (clear large red triangular prism)
    (clear yellow cylinder_1)
    (clear yellow cylinder_2)
    (clear yellow half cylinder)
    (clear small blue cube)
    (clear blue half cylinder_1)
    (clear blue half cylinder_2)
    (clear large green triangular prism_1)
    (clear large green triangular prism_2)
    (clear small green triangular prism)
    (handempty)
  )
  (:goal (and ))
)