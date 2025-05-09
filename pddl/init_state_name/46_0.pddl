(define (problem scene1)
  (:domain manip)
  (:objects
    long red block_1 - support
    long red block_2 - support
    red cylinder - item
    yellow cylinder_1 - item
    yellow cylinder_2 - item
    small blue triangular prism - item
    blue cylinder - item
    small green cube - support
    long green block - support
    large green triangular prism - item
  )
  (:init
    (ontable long red block_1)
    (ontable long red block_2)
    (ontable red cylinder)
    (ontable yellow cylinder_1)
    (ontable yellow cylinder_2)
    (ontable small blue triangular prism)
    (ontable blue cylinder)
    (ontable small green cube)
    (ontable long green block)
    (ontable large green triangular prism)
    (clear long red block_1)
    (clear long red block_2)
    (clear red cylinder)
    (clear yellow cylinder_1)
    (clear yellow cylinder_2)
    (clear small blue triangular prism)
    (clear blue cylinder)
    (clear small green cube)
    (clear long green block)
    (clear large green triangular prism)
    (handempty)
  )
  (:goal (and ))
)