(define (problem scene1)
  (:domain manip)
  (:objects
    apple - item
    orange - item
    mango - item
    red chili pepper - item
    purple jello box - support
    blue bowl - container
    pink bowl - container
    blue lid - lid
    pink lid - lid
  )
  (:init
    (ontable apple)
    (ontable orange)
    (ontable mango)
    (ontable red chili pepper)
    (ontable purple jello box)
    (ontable blue bowl)
    (ontable pink bowl)
    (ontable blue lid)
    (ontable pink lid)
    (clear apple)
    (clear orange)
    (clear mango)
    (clear red chili pepper)
    (clear purple jello box)
    (clear blue bowl)
    (clear pink bowl)
    (handempty)
  )
  (:goal (and ))
)